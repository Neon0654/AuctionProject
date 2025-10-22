import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, User } from 'lucide-react';
import { Bid } from '@/lib/api';

interface BidHistoryCardProps {
  bids: Bid[];
  formatPrice: (price?: number) => string;
}

export const BidHistoryCard = ({ bids, formatPrice }: BidHistoryCardProps) => {
  return (
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
              <div
                key={bid.id ?? `${bid.userId}-${bid.bidTime}`}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
              >
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
  );
};
