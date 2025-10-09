const API_BASE_URL = "http://localhost:8080/api";

class AdminApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem("adminAuthToken");
  }

  // Set auth token in localStorage
  setAuthToken(token: string) {
    console.log("Setting admin auth token:", token ? "Token received" : "No token");
    localStorage.setItem("adminAuthToken", token);
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    localStorage.removeItem("adminAuthToken");
  }

  // Get headers with auth token
  getHeaders() {
    const token = this.getAuthToken();
    console.log(
      "Getting headers with token:",
      token ? "Token exists" : "No token"
    );
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Generic request method
  async request(endpoint: string, method: string = "GET", body: any = null) {
    try {
      const headers = this.getHeaders();
      const url = `${this.baseURL}${endpoint}`;

      console.log("API Request:", {
        url,
        method,
        headers,
        body,
      });

      const options: RequestInit = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
      };

      const response = await fetch(url, options);

      console.log("API Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, remove it
          this.removeAuthToken();
          throw new Error("Authentication expired. Please login again.");
        }

        const errorData = await response.json().catch(() => ({}));
        console.log("Error response data:", errorData);
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Authentication APIs
  async login(email: string, password: string) {
    console.log("Admin login attempt with:", { email, password });
    const response = await this.request("/admin/auth/login", "POST", {
      email,
      password,
    });

    console.log("Admin login response:", response);

    if (response.token) {
      this.setAuthToken(response.token);
    }

    return response;
  }

  async getCurrentAdmin() {
    return await this.request("/admin/auth/me");
  }

  // User Management APIs
  async getUsers(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await this.request(`/admin/users?${queryParams}`);
  }

  async getUserById(id: number) {
    return await this.request(`/admin/users/${id}`);
  }

  async updateUserStatus(id: number, isActive: boolean, reason?: string) {
    return await this.request(`/admin/users/${id}/status`, "PATCH", {
      isActive,
      reason,
    });
  }

  async deleteUser(id: number) {
    return await this.request(`/admin/users/${id}`, "DELETE");
  }

  async getUserAnalytics() {
    return await this.request("/admin/analytics/users");
  }

  // Venue Management APIs
  async getVenues(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await this.request(`/admin/venues?${queryParams}`);
  }

  async getVenueById(id: number) {
    return await this.request(`/admin/venues/${id}`);
  }

  async approveVenue(id: number, approved: boolean, reason?: string) {
    return await this.request(`/admin/venues/${id}/approve`, "PATCH", {
      approved,
      reason,
    });
  }

  async updateVenueStatus(id: number, isActive: boolean, reason?: string) {
    return await this.request(`/admin/venues/${id}/status`, "PATCH", {
      isActive,
      reason,
    });
  }

  async deleteVenue(id: number) {
    return await this.request(`/admin/venues/${id}`, "DELETE");
  }

  async getVenueAnalytics() {
    return await this.request("/admin/analytics/venues");
  }

  // Venue Owner Management APIs
  async getVenueOwners(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await this.request(`/admin/venue-owners?${queryParams}`);
  }

  async getVenueOwnerById(id: number) {
    return await this.request(`/admin/venue-owners/${id}`);
  }

  async updateVenueOwnerStatus(id: number, isActive: boolean, reason?: string) {
    return await this.request(`/admin/venue-owners/${id}/status`, "PATCH", {
      isActive,
      reason,
    });
  }

  async approveVenueOwner(id: number, approved: boolean, reason?: string) {
    return await this.request(`/admin/venue-owners/${id}/approve`, "PATCH", {
      approved,
      reason,
    });
  }

  // Booking Management APIs
  async getBookings(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await this.request(`/admin/bookings?${queryParams}`);
  }

  async getBookingById(id: number) {
    return await this.request(`/admin/bookings/${id}`);
  }

  async cancelBooking(id: number, reason: string) {
    return await this.request(`/admin/bookings/${id}/cancel`, "PATCH", {
      reason,
    });
  }

  async getBookingAnalytics() {
    return await this.request("/admin/analytics/bookings");
  }

  // Dashboard APIs
  async getDashboardStats() {
    return await this.request("/admin/dashboard/stats");
  }

  async getRevenueAnalytics(dateRange: string = "month") {
    return await this.request(`/admin/analytics/revenue?dateRange=${dateRange}`);
  }

  // Payment Management APIs
  async getPayments(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await this.request(`/admin/payments?${queryParams}`);
  }

  async getPaymentById(id: number) {
    return await this.request(`/admin/payments/${id}`);
  }

  async processRefund(paymentId: number, amount: number, reason: string) {
    return await this.request(`/admin/payments/${paymentId}/refund`, "POST", {
      amount,
      reason,
    });
  }

  // Review Management APIs
  async getReviews(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await this.request(`/admin/reviews?${queryParams}`);
  }

  async getReviewById(id: number) {
    return await this.request(`/admin/reviews/${id}`);
  }

  async moderateReview(id: number, action: 'APPROVE' | 'REJECT' | 'HIDE', reason?: string) {
    return await this.request(`/admin/reviews/${id}/moderate`, "PATCH", {
      action,
      reason,
    });
  }

  // Admin Actions Log APIs
  async getAdminActions(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await this.request(`/admin/actions?${queryParams}`);
  }

  async createAdminAction(actionData: any) {
    return await this.request("/admin/actions", "POST", actionData);
  }

  // Reports APIs
  async generateReport(reportType: string, filters: any = {}) {
    const queryParams = new URLSearchParams({ ...filters, type: reportType }).toString();
    return await this.request(`/admin/reports/generate?${queryParams}`);
  }

  async downloadReport(reportId: string) {
    return await this.request(`/admin/reports/${reportId}/download`);
  }

  // Notification APIs
  async sendNotification(notificationData: any) {
    return await this.request("/admin/notifications/send", "POST", notificationData);
  }

  async getNotifications(filters: any = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return await this.request(`/admin/notifications?${queryParams}`);
  }

  // Logout
  async logout() {
    this.removeAuthToken();
  }
}

export default new AdminApiService();
