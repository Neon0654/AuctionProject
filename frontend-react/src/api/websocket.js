// src/websocket.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let listeners = [];

export function connectWebSocket(sessionId) {
  if (!sessionId) {
    console.error("sessionId is undefined, cannot connect WebSocket");
    return;
  }

  const socket = new SockJS("http://localhost:8080/ws/auction");
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: (str) => console.log(str),
  });

  stompClient.onConnect = () => {
    console.log("STOMP connected to session", sessionId);

    stompClient.subscribe(`/topic/auction/${sessionId}`, (message) => {
      const data = JSON.parse(message.body);
      listeners.forEach((fn) => fn(data));
    });
  };

  stompClient.onStompError = (err) => {
    console.error("STOMP error:", err);
  };

  stompClient.activate();
}

export function sendBid(sessionId, bidAmount, bidder) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: `/app/auction/${sessionId}`,
      body: JSON.stringify({ amount: bidAmount, bidder }),
    });
  } else {
    console.error("Cannot send bid, STOMP not connected");
  }
}

export function addMessageListener(fn) {
  listeners.push(fn);
}

export function removeMessageListener(fn) {
  listeners = listeners.filter((l) => l !== fn);
}

export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    listeners = [];
    console.log("STOMP disconnected");
  }
}
