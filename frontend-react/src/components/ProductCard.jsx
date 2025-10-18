import { motion } from "framer-motion";
import errorImg from "../assets/error.jpg";

export default function ProductCard({ product, onSelect }) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 w-[200px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onSelect(product.id)}
    >
      {/* Ảnh sản phẩm */}
      <div className="relative w-full h-[150px] flex items-center justify-center bg-gray-50">
        <motion.img
          src={product.imageUrl || errorImg}
          alt={product.name}
          className="w-[180px] h-[180px] object-cover rounded-md"
          style={{
            minWidth: "180px",
            minHeight: "180px",
            maxWidth: "180px",
            maxHeight: "180px",
          }}
          whileHover={{
            scale: 1.05,
            y: -5,
            transition: { duration: 0.3, ease: "easeOut" },
          }}
        />
        <div className="absolute top-2 left-2 bg-white/90 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
          #{product.id || "000"}
        </div>
      </div>

      {/* Nội dung */}
      <div className="p-3 text-center">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2 min-h-[32px]">
          {product.description || "Không có mô tả"}
        </p>
        <span className="text-base font-bold text-red-500 block mt-2">
          {product.price ? `${product.price}$` : "—"}
        </span>
      </div>
    </motion.div>
  );
}
