import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Gavel, User, LogOut, Plus, LayoutDashboard } from 'lucide-react';

export const Header = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return null; // tránh flash UI khi F5

  return (
    <header className="border-b border-border bg-card shadow-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Gavel className="w-7 h-7" />
          <span>AuctionHub</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost">Đấu giá</Button>
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/create">
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Tạo đấu giá
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" className="gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-3 ml-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{user?.username}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <Link to="/auth">
              <Button className="gradient-primary">Đăng nhập</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
