import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gavel } from 'lucide-react';
import { AuctionSession } from '@/lib/api';

interface PlaceBidCardProps {
  auction: AuctionSession;
  bidAmount: string;
  setBidAmount: (val: string) => void;
  handlePlaceBid: (e: React.FormEvent) => void;
  submitting: boolean;
  wsConnected: boolean;
}

export const PlaceBidCard = ({
  auction,
  bidAmount,
  setBidAmount,
  handlePlaceBid,
  submitting,
  wsConnected,
}: PlaceBidCardProps) => {
  const minBid = (auction.currentPrice ?? 0) + 1000;

  return (
    <Card className="shadow-elevated">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Gavel className="w-5 h-5" /> Đặt giá
        </CardTitle>
        <Badge variant={wsConnected ? 'outline' : 'destructive'} className="w-fit">
          <span className={`w-2 h-2 rounded-full mr-2 ${wsConnected ? 'bg-success' : 'bg-destructive'}`}></span>
          {wsConnected ? 'Realtime' : 'Mất kết nối'}
        </Badge>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePlaceBid} className="space-y-4">
          <div>
            <Input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Nhập giá đặt"
              min={minBid}
              step={1000}
              required
            />
            <p className="text-xs text-muted-foreground mt-2">
              Giá tối thiểu: {minBid.toLocaleString('vi-VN')} VND
            </p>
          </div>
          <Button type="submit" className="w-full gradient-primary" disabled={submitting}>
            {submitting ? 'Đang đặt giá...' : 'Đặt giá'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
