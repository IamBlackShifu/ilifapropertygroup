export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}
