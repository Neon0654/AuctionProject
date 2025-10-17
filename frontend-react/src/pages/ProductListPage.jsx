import { useEffect, useState } from "react";
import { getProducts } from "../api/api";

export default function ProductListPage({ onSelectProduct }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div>
      <h1>Danh sách sản phẩm</h1>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - Giá: {p.price}$
            <button onClick={() => onSelectProduct(p.id)}>Xem đấu giá</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
