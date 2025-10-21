const API_BASE_URL = 'http://localhost:8080/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  owner?: { id: number };
}

export interface Bid {
  id: number;
  sessionId: number;
  userId: number;
  username: string;
  amount: number;
  timestamp: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuctionSession {
  id: number;
  productId: number;
  productName: string;
  startTime: string;
  endTime: string;
  status: 'ACTIVE' | 'ENDED' | 'PENDING';
  currentPrice: number;
  highestBidder?: string;
}

class ApiService {
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // ------------------ Product ------------------
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE_URL}/products`, {
      headers: this.getHeaders(false),
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  }

  async getProductById(id: number): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: this.getHeaders(false),
    });
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  }

  async deleteProduct(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });
    if (!res.ok) throw new Error('Failed to delete product');
  }

  // ------------------ Auction Session ------------------
  async createAuctionSession(productId: string, startTime: string, endTime: string): Promise<AuctionSession> {
    const res = await fetch(
      `${API_BASE_URL}/auction/create?productId=${productId}&startTime=${startTime}&endTime=${endTime}`,
      {
        method: 'POST',
        headers: this.getHeaders(true),
      }
    );
    if (!res.ok) throw new Error('Failed to create auction session');
    return res.json();
  }

  async getAuctionSessionByProductId(productId: number): Promise<AuctionSession> {
    const res = await fetch(`${API_BASE_URL}/products/${productId}/active-session`, {
      headers: this.getHeaders(false),
    });
    if (!res.ok) throw new Error('Failed to fetch auction session');
    return res.json();
  }

  async placeBidInAuction(sessionId: string, userId: string, amount: number): Promise<Bid> {
    const res = await fetch(
      `${API_BASE_URL}/auction/${sessionId}/bid?bidder=${userId}&amount=${amount}`,
      {
        method: 'POST',
        headers: this.getHeaders(true),
      }
    );
    if (!res.ok) throw new Error('Failed to place bid');
    return res.json();
  }

  async endAuction(sessionId: string): Promise<AuctionSession> {
    const res = await fetch(`${API_BASE_URL}/auction/${sessionId}/end`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });
    if (!res.ok) throw new Error('Failed to end auction');
    return res.json();
  }

  async getBidsByAuction(sessionId: string): Promise<Bid[]> {
    const res = await fetch(`${API_BASE_URL}/auction/${sessionId}/bids`, {
      headers: this.getHeaders(false),
    });
    if (!res.ok) throw new Error('Failed to fetch bid history');
    return res.json();
  }

  async getAuctionFullHistory(sessionId: string): Promise<Bid[]> {
    const res = await fetch(`${API_BASE_URL}/auction/full-history/${sessionId}`, {
      headers: this.getHeaders(false),
    });
    if (!res.ok) throw new Error('Failed to fetch full auction history');
    return res.json();
  }

  // ------------------ Auth ------------------
  async login(data: LoginRequest): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  }

  async register(data: RegisterRequest): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  }
}

export const apiService = new ApiService();
