const BASE_URL = "http://localhost:8080/api"; // URL backend Spring của bạn

// Lấy danh sách sản phẩm
export async function getProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProductById(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

// Lấy lịch sử đấu giá full
export async function getAuctionHistory(sessionId) {
  const res = await fetch(`${BASE_URL}/auction/full-history/${sessionId}`);
  if (!res.ok) throw new Error("Failed to fetch auction history");
  return res.json();
}

// Gửi bid qua REST (nếu bạn muốn dùng REST thay vì WebSocket)
export async function placeBid(sessionId, userId, amount) {
  const params = new URLSearchParams({ bidder: userId, amount });
  const res = await fetch(`${BASE_URL}/auction/${sessionId}/bid?${params}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to place bid");
  return res.json();
}
