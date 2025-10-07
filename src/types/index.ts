// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'CUSTOMER' | 'VENUE_OWNER';
  userType: 'CUSTOMER' | 'VENUE_OWNER';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser extends User {
  role: 'ADMIN';
  permissions: string[];
  lastLogin: string;
}

// Venue Types
export interface Venue {
  id: number;
  name: string;
  address: string;
  location: string;
  description: string;
  contactNo: string;
  email: string;
  venueType: 'INDOOR' | 'OUTDOOR';
  maxCapacity: number;
  parkingAvailable: boolean;
  foodAvailable: boolean;
  changingRoomsAvailable: boolean;
  showerAvailable: boolean;
  wifiAvailable: boolean;
  basePrice: number;
  ownerId: number;
  owner: User;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Court Types
export interface Court {
  id: number;
  name: string;
  sportType: string;
  capacity: number;
  hourlyRate: number;
  isActive: boolean;
  venueId: number;
  venue: Venue;
  createdAt: string;
  updatedAt: string;
}

// Booking Types
export interface Booking {
  id: number;
  customerId: number;
  customer: User;
  bookingDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  courtBookings: CourtBooking[];
  createdAt: string;
  updatedAt: string;
}

export interface CourtBooking {
  id: number;
  courtId: number;
  court: Court;
  timeDuration: number;
  price: number;
}

// Payment Types
export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
}

// Review Types
export interface Review {
  id: number;
  customerId: number;
  customer: User;
  venueId: number;
  venue: Venue;
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

// Analytics Types
export interface DashboardStats {
  totalUsers: number;
  totalVenues: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  pendingVenues: number;
  pendingBookings: number;
  monthlyRevenue: number;
  monthlyBookings: number;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  userGrowthRate: number;
  usersByRole: {
    customers: number;
    venueOwners: number;
    admins: number;
  };
}

export interface VenueAnalytics {
  totalVenues: number;
  activeVenues: number;
  pendingApprovals: number;
  venuesByType: {
    indoor: number;
    outdoor: number;
  };
  topPerformingVenues: Array<{
    venue: Venue;
    revenue: number;
    bookings: number;
  }>;
}

export interface BookingAnalytics {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  averageBookingValue: number;
  bookingsByStatus: {
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Filter Types
export interface UserFilters {
  role?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  size?: number;
}

export interface VenueFilters {
  isApproved?: boolean;
  isActive?: boolean;
  venueType?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface BookingFilters {
  status?: string;
  customerId?: number;
  venueId?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
}

// Admin Action Types
export interface AdminAction {
  id: number;
  adminId: number;
  admin: AdminUser;
  actionType: 'USER_SUSPENDED' | 'USER_ACTIVATED' | 'VENUE_APPROVED' | 'VENUE_REJECTED' | 'BOOKING_CANCELLED';
  targetId: number;
  targetType: 'USER' | 'VENUE' | 'BOOKING';
  reason: string;
  createdAt: string;
}

// Settings Types
export interface PlatformSettings {
  id: number;
  platformName: string;
  platformCommission: number;
  maxBookingAdvanceDays: number;
  cancellationPolicy: string;
  refundPolicy: string;
  supportEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  createdAt: string;
  updatedAt: string;
}
