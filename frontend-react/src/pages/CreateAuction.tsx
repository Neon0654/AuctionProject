import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const CreateAuction = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    endTime: '',
    imageUrl: '',
  });

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Tạo sản phẩm
      const product = await apiService.createProduct({
        name: formData.title,
        description: formData.description,
        price: parseFloat(formData.startingPrice),
        imageUrl: formData.imageUrl || undefined,
        owner: { id: user.id }
      });

      // 2️⃣ Tạo phiên đấu giá
      const startTime = new Date().toISOString().slice(0, 19); // loại bỏ Z
      const endTime = new Date(formData.endTime).toISOString().slice(0, 19);

      await apiService.createAuctionSession(
        product.id.toString(),
        startTime,
        endTime
      );

      toast({
        title: 'Tạo đấu giá thành công!',
        description: 'Đấu giá của bạn đã được đăng',
      });

      navigate('/');
    } catch (error: any) {
      console.error('Failed to create auction:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tạo đấu giá. Vui lòng thử lại',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-2xl">Tạo đấu giá mới</CardTitle>
            <CardDescription>
              Điền thông tin để bắt đầu đấu giá sản phẩm của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tiêu đề */}
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề sản phẩm"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Mô tả */}
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả *</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả chi tiết về sản phẩm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              {/* Giá khởi điểm */}
              <div className="space-y-2">
                <Label htmlFor="startingPrice">Giá khởi điểm (VNĐ) *</Label>
                <Input
                  id="startingPrice"
                  type="number"
                  placeholder="100000"
                  value={formData.startingPrice}
                  onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                  min="1000"
                  step="1000"
                  required
                />
              </div>

              {/* Thời gian kết thúc */}
              <div className="space-y-2">
                <Label htmlFor="endTime">Thời gian kết thúc *</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>

              {/* URL hình ảnh */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL hình ảnh</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Tùy chọn: Thêm URL hình ảnh sản phẩm
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1 gradient-primary" disabled={loading}>
                  {loading ? 'Đang tạo...' : 'Tạo đấu giá'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateAuction;
