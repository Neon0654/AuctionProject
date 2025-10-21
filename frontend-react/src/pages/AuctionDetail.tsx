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
import errorImg from '@/assets/error.jpg'; // ảnh mặc định

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

  // ------------------- Fetch auction & bid history -------------------
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
        toast({ title: 'Lỗi', description: 'Không thể tải thông tin đấu giá', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, toast]);

  // ------------------- WebSocket realtime -------------------
  useEffect(() => {
    if (!id) return;
    const connectWs = async () => {
      try {
        await wsService.connect();
        setWsConnected(true);
        wsService.subscribeToAuction(parseInt(id), (bidUpdate: Bid) => {
          setBids(prev => [bidUpdate, ...prev]);
          setAuction(prev => prev ? { ...prev, currentPrice: bidUpdate.amount } : prev);

          if (bidUpdate.userId !== user?.id) {
            toast({
              title: 'Có người đặt giá mới!',
              description: `${bidUpdate.username || 'Người dùng ẩn danh'} đã đặt giá ${formatPrice(bidUpdate.amount)}`,
            });
          }
        });
      } catch (error) {
        console.error('WebSocket connection failed:', error);
      }
    };
    connectWs();
    return () => {
      wsService.unsubscribeFromAuction(parseInt(id));
    };
  }, [id, user, toast]);

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
    if (isNaN(amount) || amount < (auction.currentPrice + 1000)) {
      toast({
        title: 'Giá không hợp lệ',
        description: `Giá đặt phải ≥ ${formatPrice(auction.currentPrice + 1000)}`,
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const bidFromApi = await apiService.placeBidInAuction(
        auction.id.toString(),
        user.username, // ✅ gửi username thay vì id
        amount
      );

      // Cập nhật state ngay với user hiện tại
      const newBid: Bid = {
        ...bidFromApi,
        username: user.username || `User #${user.id}`,
        userId: user.id,
        amount: bidFromApi.amount ?? amount,
      };

      setBids(prev => [newBid, ...prev]);
      setAuction(prev => prev ? { ...prev, currentPrice: newBid.amount } : prev);
      setBidAmount((newBid.amount + 1000).toString());

      toast({ title: 'Đặt giá thành công!', description: `Bạn đã đặt giá ${formatPrice(newBid.amount)}` });
    } catch (error) {
      console.error(error);
      toast({ title: 'Lỗi', description: 'Không thể đặt giá. Vui lòng thử lại', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------- Render -------------------
  if (loading) return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    </div>
  );

  if (!auction) return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-lg text-muted-foreground">Không tìm thấy đấu giá</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-elevated">
              <div className="relative h-96 bg-muted overflow-hidden">
                <img
                  src={auction.imageUrl || errorImg} // nếu không có ảnh thì dùng errorImg
                  alt={auction.productName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={auction.status === 'ACTIVE' ? 'bg-success text-success-foreground' : ''}>
                    {auction.status === 'ACTIVE' ? 'Đang đấu giá' : 'Đã kết thúc'}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-3xl">{auction.productName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Giá hiện tại</p>
                    <p className="text-2xl font-bold text-primary">{formatPrice(auction.currentPrice)}</p>
                  </div>
                </div>
                {auction.status === 'ACTIVE' && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <span>Kết thúc sau: {formatTimeRemaining(auction.endTime)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right panel */}
          <div className="space-y-6">
            {auction.status === 'ACTIVE' && (
              <Card className="shadow-elevated">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="w-5 h-5" /> Đặt giá
                  </CardTitle>
                  {wsConnected && (
                    <Badge variant="outline" className="w-fit">
                      <span className="w-2 h-2 bg-success rounded-full mr-2"></span> Realtime
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePlaceBid} className="space-y-4">
                    <div>
                      <Input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Nhập giá đặt"
                        min={auction.currentPrice + 1000}
                        step={1000}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Giá tối thiểu: {formatPrice(auction.currentPrice + 1000)}
                      </p>
                    </div>
                    <Button type="submit" className="w-full gradient-primary" disabled={submitting}>
                      {submitting ? 'Đang đặt giá...' : 'Đặt giá'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Lịch sử đấu giá ({bids.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bids.length > 0 ? (
                    bids.map((bid) => (
                      <div key={bid.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-sm">
                            {bid.username || (bid.userId != null ? `User #${bid.userId}` : 'Người dùng ẩn danh')}
                          </span>
                        </div>
                        <span className="font-bold text-primary">{formatPrice(bid.amount)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-8">Chưa có lượt đặt giá nào</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuctionDetail;
