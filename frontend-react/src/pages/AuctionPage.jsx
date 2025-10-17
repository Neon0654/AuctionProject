import { useEffect, useState } from "react";
import { connectWebSocket, addMessageListener, removeMessageListener, sendBid } from "../api/websocket";

export default function AuctionPage({ sessionId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    connectWebSocket(sessionId);

    const listener = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    addMessageListener(listener);

    return () => removeMessageListener(listener);
  }, [sessionId]);

  const handleBid = () => {
    sendBid(sessionId, { amount: 100 }); // ví dụ gửi giá 100
  };

  return (
    <div>
      <h1>Auction Page</h1>
      <button onClick={handleBid}>Place Bid</button>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>
  );
}
