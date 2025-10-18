import React, { useState, useEffect } from "react";
import { getProductById, placeBid } from "../api/api";
import { connectWebSocket, disconnectWebSocket, addMessageListener, removeMessageListener } from "../api/websocket";

export default function AuctionPage({ sessionId, userId }) {
  const [product, setProduct] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [highestBidder, setHighestBidder] = useState("");
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    if (!sessionId) return;

    let listener;

    // Lấy thông tin product
    getProductById(sessionId)
      .then(res => {
        setProduct(res);

        if (res.activeSession) {
          setCurrentPrice(res.activeSession.currentPrice);
          setHighestBidder(res.activeSession.highestBidder);

          // Kết nối WebSocket
          connectWebSocket(res.activeSession.id);

          listener = (data) => {
            setCurrentPrice(data.currentPrice);
            setHighestBidder(data.highestBidder);
          };
          addMessageListener(listener);
        }
      })
      .catch(err => console.error(err));

    return () => {
      disconnectWebSocket();
      if (listener) removeMessageListener(listener);
    };
  }, [sessionId]);

  const handleBid = async () => {
    if (!product.activeSession || bidAmount <= currentPrice) {
      alert("Bid must be higher than current price!");
      return;
    }

    try {
      // Gửi bid qua REST
      await placeBid(product.activeSession.id, userId, Number(bidAmount));
      setBidAmount("");
      // Không cần setCurrentPrice trực tiếp, WebSocket sẽ cập nhật tự động
    } catch (err) {
      console.error(err);
      alert("Failed to place bid");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p>{product.description}</p>
      <p className="mt-2">Giá hiện tại: <strong>${currentPrice}</strong></p>
      <p>Người đặt cao nhất: <strong>{highestBidder || "Chưa có ai"}</strong></p>

      <div className="mt-4 flex gap-2">
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="border px-2 py-1 flex-1"
          placeholder="Nhập giá thầu"
        />
        <button
          onClick={handleBid}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Đặt giá
        </button>
      </div>
    </div>
  );
}
