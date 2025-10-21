import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp } from 'lucide-react';
import { Auction } from '@/lib/api';
import errorImg from '@/assets/error.jpg';

interface AuctionCardProps {
  auction: Auction;
}

export const AuctionCard = ({ auction }: AuctionCardProps) => {
  // Format giá an toàn, tránh NaN
  const formatPrice = (price?: number) => {
    if (price == null || isNaN(price)) return 'Chưa có giá';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Lấy giá hiện tại từ activeSession nếu có
  const currentPrice = auction.activeSession?.currentPrice;
  const startingPrice = auction.price;

  // Format thời gian còn lại
  const formatTimeRemaining = (endTime?: string) => {
    if (!endTime) return 'Không có thông tin';
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff < 0) return 'Đã kết thúc';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} ngày`;
    }
    return `${hours}h ${minutes}m`;
  };

  // Badge trạng thái
  const getStatusBadge = (status?: string) => {
    if (status === 'ACTIVE') {
      return <Badge className="bg-success text-success-foreground">Đang đấu giá</Badge>;
    }
    if (status === 'ENDED') {
      return <Badge variant="secondary">Đã kết thúc</Badge>;
    }
    return <Badge variant="outline">Chờ bắt đầu</Badge>;
  };

  return (
    <Card className="hover:shadow-elevated transition-smooth overflow-hidden group">
      <div className="relative h-48 bg-muted overflow-hidden">
        {auction.imageUrl ? (
          <img
            src={auction.imageUrl}
            alt={auction.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <img
            src={errorImg}
            alt="Không có hình"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-3 right-3">{getStatusBadge(auction.activeSession?.status)}</div>
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg">{auction.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{auction.description}</p>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">Giá hiện tại</p>
            <p className="text-xl font-bold text-primary">{formatPrice(currentPrice)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Giá khởi điểm</p>
            <p className="text-sm font-medium">{formatPrice(startingPrice)}</p>
          </div>
        </div>

        {auction.activeSession?.status === 'ACTIVE' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Kết thúc sau: {formatTimeRemaining(auction.activeSession?.endTime)}</span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Link to={`/auction/${auction.id}`} className="w-full">
          <Button className="w-full gradient-primary">
            {auction.activeSession?.status === 'ACTIVE' ? 'Tham gia đấu giá' : 'Xem chi tiết'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
