import './index.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import ProductListPage from "./pages/ProductListPage";
import AuctionPage from "./pages/AuctionPage";

function App() {
  return (
    <Router>
      <div className="app-wrapper">

        {/* Header */}
        <Header />

        {/* Main layout */}
        <main className="main-layout">
          {/* Sidebar trái */}
          <aside className="sidebar sidebar-left">
            <h2>Danh mục</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Đồng hồ</li>
              <li>Trang sức</li>
              <li>Đồ cổ</li>
              <li>Nghệ thuật</li>
            </ul>
          </aside>

          {/* Nội dung chính */}
          <section className="main-content">
            <Routes>
              <Route path="/" element={<ProductListPage />} />
              <Route path="/auction/session/:sessionId" element={<AuctionPageWrapper />} />
            </Routes>
          </section>

          {/* Sidebar phải */}
          <aside className="sidebar sidebar-right">
            <h2>Thông báo</h2>
            <p className="text-sm text-gray-600">
              Theo dõi các phiên đấu giá sắp tới và các ưu đãi đặc biệt.
            </p>
          </aside>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

// Wrapper để truyền userId vào AuctionPage
const AuctionPageWrapper = () => {
  const { sessionId } = useParams();
  const userId = 1;
  return <AuctionPage sessionId={sessionId} userId={userId} />;
};

export default App;
