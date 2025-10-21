import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { AuctionCard } from '@/components/AuctionCard';
import { apiService, Auction } from '@/lib/api';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data = await apiService.getProducts();
        setAuctions(data);
      } catch (error) {
        console.error('Failed to fetch auctions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Khám phá các cuộc đấu giá
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tham gia đấu giá trực tuyến và sở hữu những sản phẩm độc đáo với giá tốt nhất
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : auctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {auctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">
              Hiện chưa có cuộc đấu giá nào
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
