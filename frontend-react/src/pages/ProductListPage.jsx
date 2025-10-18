import { useEffect, useState } from "react";
import { getProducts } from "../api/api";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🏆 Danh sách sản phẩm đấu giá
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          Hiện chưa có sản phẩm nào.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={() => {
                if (p.activeSession) {
                  navigate(`/auction/session/${p.activeSession.id}`);
                } else {
                  alert("Sản phẩm này chưa có phiên đấu giá ACTIVE.");
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
