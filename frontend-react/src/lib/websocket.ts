import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_BASE_URL = 'http://localhost:8080';

export interface BidUpdate {
  id: number;
  auctionId: number;
  userId: number;
  amount: number;
  bidTime: string;
  username?: string;
}

export class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<number, any> = new Map();
  private connected = false;
  private pendingSubscriptions: (() => void)[] = [];

  async connect(): Promise<void> {
    if (this.connected && this.client) return;

    return new Promise((resolve, reject) => {
      this.client = new Client({
        // ✅ phải khớp endpoint bên Spring: registry.addEndpoint("/ws").withSockJS()
        webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws/auction`),

        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        debug: (str) => console.log('STOMP:', str),

        onConnect: () => {
          console.log('✅ WebSocket connected');
          this.connected = true;
          resolve();

          // chạy tất cả subscription còn pending
          this.pendingSubscriptions.forEach((fn) => fn());
          this.pendingSubscriptions = [];
        },

        onStompError: (frame) => {
          console.error('❌ STOMP error:', frame);
          reject(new Error('WebSocket connection failed'));
        },
      });

      this.client.activate();
    });
  }

  subscribeToAuction(auctionId: number, callback: (bid: BidUpdate) => void): void {
    const doSubscribe = () => {
      if (!this.client || !this.client.connected) {
        console.warn('⚠️ Cannot subscribe — client not connected yet');
        return;
      }

      // tránh double subscribe
      if (this.subscriptions.has(auctionId)) {
        console.log('Already subscribed to auction', auctionId);
        return;
      }

      const sub = this.client.subscribe(`/topic/auction/${auctionId}`, (message: IMessage) => {
        try {
          const bid: BidUpdate = JSON.parse(message.body);
          console.log('📩 Received bid update:', bid);
          callback(bid);
        } catch (err) {
          console.error('❌ Failed to parse WS message:', err);
        }
      });

      this.subscriptions.set(auctionId, sub);
      console.log('✅ Subscribed to auction:', auctionId);
    };

    if (!this.connected) {
      console.log('⏳ WebSocket not connected yet, queueing subscription...');
      this.pendingSubscriptions.push(doSubscribe);
    } else {
      doSubscribe();
    }
  }

  unsubscribeFromAuction(auctionId: number): void {
    const sub = this.subscriptions.get(auctionId);
    if (sub) {
      sub.unsubscribe();
      this.subscriptions.delete(auctionId);
      console.log('❌ Unsubscribed from auction:', auctionId);
    }
  }

  disconnect(): void {
    if (this.client) {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
      this.subscriptions.clear();
      this.client.deactivate();
      this.client = null;
      this.connected = false;
      this.pendingSubscriptions = [];
      console.log('🔌 WebSocket disconnected');
    }
  }
}

export const wsService = new WebSocketService();
