import { useState } from "react";
import ProductListPage from "./pages/ProductListPage";
import AuctionPage from "./pages/AuctionPage";

function App() {
  const [currentPage, setCurrentPage] = useState("products");
  const [selectedSession, setSelectedSession] = useState(null);

  const userId = 1; // demo user

  return (
    <div>
      {currentPage === "products" && (
        <ProductListPage
          onSelectProduct={(sessionId) => {
            setSelectedSession(sessionId);
            setCurrentPage("auction");
          }}
        />
      )}

      {currentPage === "auction" && selectedSession && (
        <AuctionPage sessionId={selectedSession} userId={userId} />
      )}
    </div>
  );
}

export default App;
