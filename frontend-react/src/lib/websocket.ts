import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_BASE_URL = 'http://localhost:8080';
// const WS_BASE_URL = 'https://nontheistically-subcutaneous-albertina.ngrok-free.dev';


export interface BidMessage {
  auctionId: number;
  userId: number;
  amount: number;
}

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

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = new Client({
        // use SockJS endpoint for Spring SockJS fallback: /ws/auction
        webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws/auction`),
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('WebSocket connected');
          resolve();
        },
        onStompError: (frame) => {
          console.error('STOMP error:', frame);
          reject(new Error('WebSocket connection failed'));
        },
      });

      this.client.activate();
    });
  }

  subscribeToAuction(auctionId: number, callback: (bid: BidUpdate) => void): void {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket not connected');
      return;
    }

    if (this.subscriptions.has(auctionId)) {
      console.log('Already subscribed to auction', auctionId);
      return;
    }

    const subscription = this.client.subscribe(
      `/topic/auction/${auctionId}`,
      (message) => {
        const bid: BidUpdate = JSON.parse(message.body);
        console.log('Received bid update:', bid);
        callback(bid);
      }
    );

    this.subscriptions.set(auctionId, subscription);
    console.log('Subscribed to auction:', auctionId);
  }

  unsubscribeFromAuction(auctionId: number): void {
    const subscription = this.subscriptions.get(auctionId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(auctionId);
      console.log('Unsubscribed from auction:', auctionId);
    }
  }

  placeBid(bidMessage: BidMessage): void {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket not connected');
      throw new Error('WebSocket not connected');
    }

    this.client.publish({
      destination: '/app/bid',
      body: JSON.stringify(bidMessage),
    });
    console.log('Bid placed:', bidMessage);
  }

  // Disconnect and clean up subscriptions
  disconnect(): void {
    if (this.client) {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
      this.subscriptions.clear();
      this.client.deactivate();
      this.client = null;
      console.log('WebSocket disconnected');
    }
  }
}

export const wsService = new WebSocketService();
