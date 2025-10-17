import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient;
let listeners = [];

export function connectWebSocket(sessionId) {
  const socket = new SockJS("http://localhost:8080/ws/auction"); // SockJS URL
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000, // tự reconnect nếu mất kết nối
    debug: (str) => console.log(str),
  });

  stompClient.onConnect = () => {
    console.log("STOMP connected");

    // subscribe tới topic broadcast từ server
    stompClient.subscribe("/topic/auction/" + sessionId, (message) => {
      const data = JSON.parse(message.body);
      listeners.forEach((fn) => fn(data));
    });
  };

  stompClient.onStompError = (err) => {
    console.error("STOMP error:", err);
  };

  stompClient.activate(); // kích hoạt kết nối
}

export function sendBid(sessionId, message) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/auction/" + sessionId, // gửi tới controller
      body: JSON.stringify(message),
    });
  }
}

export function addMessageListener(fn) {
  listeners.push(fn);
}

export function removeMessageListener(fn) {
  listeners = listeners.filter((l) => l !== fn);
}
