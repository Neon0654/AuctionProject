import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, AuctionSession, Bid } from '@/lib/api';
import { wsService } from '@/lib/websocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Clock, TrendingUp, User, Gavel } from 'lucide-react';
import errorImg from '@/assets/error.jpg';
import { AuctionCard } from '@/components/AuctionCard';
import { PlaceBidCard } from '@/components/PlaceBidCard';
import { BidHistoryCard } from '@/components/BidHistoryCard';

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [auction, setAuction] = useState<AuctionSession | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);

  // ------------------- Helpers -------------------
  const formatPrice = (price?: number) => {
    if (price == null || isNaN(price)) return 'Chưa có giá';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatTimeRemaining = (endTime: string) => {
    const diff = new Date(endTime).getTime() - new Date().getTime();
    if (diff < 0) return 'Đã kết thúc';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)} ngày`;
    return `${hours} giờ ${minutes} phút`;
  };

  // ------------------- Fetch auction & bids -------------------
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const auctionData = await apiService.getAuctionSessionByProductId(parseInt(id));
        const bidsData = await apiService.getBidsByAuction(auctionData.id.toString());
        setAuction({
          ...auctionData,
          currentPrice: auctionData.currentPrice ?? 0,
        });
        setBids(bidsData.sort((a, b) => b.amount - a.amount));
        setBidAmount(((auctionData.currentPrice ?? 0) + 1000).toString());
      } catch (error) {
        console.error(error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin đấu giá',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  // ------------------- WebSocket realtime -------------------
  useEffect(() => {
    if (!auction) return;

    const auctionId = auction.id;

    const connectWs = async () => {
      try {
        await wsService.connect();
        setWsConnected(true);

        wsService.subscribeToAuction(auctionId, (bidUpdate) => {
          console.log('📩 Nhận bid mới:', bidUpdate);

          setBids((prev) => {
            // tránh trùng bid
            if (prev.some((b) => b.id === bidUpdate.id)) return prev;
            return [bidUpdate, ...prev].sort((a, b) => b.amount - a.amount);
          });

          setAuction((prev) => prev ? { ...prev, currentPrice: bidUpdate.amount } : prev);

          if (bidUpdate.userId !== user?.id) {
            toast({
              title: '💥 Có người đặt giá mới!',
              description: `${bidUpdate.username || 'Người dùng ẩn danh'} đã đặt ${formatPrice(bidUpdate.amount)}`,
            });
          }
        });
      } catch (error) {
        console.error('❌ WebSocket connection failed:', error);
        setWsConnected(false);
      }
    };

    connectWs();

    return () => {
      wsService.unsubscribeFromAuction(auctionId);
      wsService.disconnect();
    };
  }, [auction, user, toast]);

  // ------------------- Place bid -------------------
  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({ title: 'Cần đăng nhập', description: 'Vui lòng đăng nhập để đặt giá', variant: 'destructive' });
      navigate('/auth');
      return;
    }
    if (!auction || !user) return;

    const amount = parseFloat(bidAmount || '0');
    if (isNaN(amount) || amount < auction.currentPrice + 1000) {
      toast({
        title: 'Giá không hợp lệ',
        description: `Giá đặt phải ≥ ${formatPrice(auction.currentPrice + 1000)}`,
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const bidFromApi = await apiService.placeBidInAuction(auction.id.toString(), user.username, amount);
      const newBid: Bid = { ...bidFromApi, username: user.username || `User #${user.id}`, userId: user.id, amount: bidFromApi.amount ?? amount };

      setBids((prev) => [newBid, ...prev]);
      setAuction((prev) => prev ? { ...prev, currentPrice: newBid.amount } : prev);
      setBidAmount((newBid.amount + 1000).toString());

      toast({
        title: '✅ Đặt giá thành công!',
        description: `Bạn đã đặt giá ${formatPrice(newBid.amount)}`,
      });
    } catch (error) {
      console.error(error);
      toast({ title: 'Lỗi', description: 'Không thể đặt giá. Vui lòng thử lại', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------- Render -------------------
  if (loading) return <LoaderScreen />; // bạn có thể giữ Loader2

  if (!auction) return <NoAuctionScreen />; // màn hình lỗi

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel */}
          <AuctionCard auction={auction} formatPrice={formatPrice} formatTimeRemaining={formatTimeRemaining} />

          {/* Right panel */}
          <div className="space-y-6">
            {auction.status === 'ACTIVE' && (
              <PlaceBidCard
                auction={auction}
                bidAmount={bidAmount}
                setBidAmount={setBidAmount}
                handlePlaceBid={handlePlaceBid}
                submitting={submitting}
                wsConnected={wsConnected}
              />
            )}

            <BidHistoryCard bids={bids} formatPrice={formatPrice} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuctionDetail;

// ------------------- Helper Components -------------------
const LoaderScreen = () => (
  <div className="min-h-screen bg-gradient-hero flex flex-col">
    <Header />
    <div className="flex justify-center items-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  </div>
);

const NoAuctionScreen = () => (
  <div className="min-h-screen bg-gradient-hero">
    <Header />
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-lg text-muted-foreground">Không tìm thấy đấu giá</p>
    </div>
  </div>
);

// AuctionCard, PlaceBidCard, BidHistoryCard có thể tách riêng hoặc để inline
// Chú ý khi render bid list, key = bid.id || `${bid.userId}-${bid.bidTime}` → duy nhất
