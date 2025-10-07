import React, { useState, useEffect } from "react";
import api from "../services/api";
import { DashboardStats } from "../types";
import {
  UsersIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error</div>
          <div className="text-gray-600">{error}</div>
          <button
            onClick={fetchDashboardStats}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      name: "Total Users",
      value: stats?.totalUsers || 0,
      icon: UsersIcon,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      name: "Total Venues",
      value: stats?.totalVenues || 0,
      icon: BuildingOfficeIcon,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      name: "Total Bookings",
      value: stats?.totalBookings || 0,
      icon: CalendarIcon,
      change: "+15%",
      changeType: "positive" as const,
    },
    {
      name: "Total Revenue",
      value: `$${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: CurrencyDollarIcon,
      change: "+23%",
      changeType: "positive" as const,
    },
  ];

  const quickStats = [
    {
      name: "Active Users",
      value: stats?.activeUsers || 0,
      icon: UsersIcon,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Pending Venues",
      value: stats?.pendingVenues || 0,
      icon: BuildingOfficeIcon,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      name: "Pending Bookings",
      value: stats?.pendingBookings || 0,
      icon: CalendarIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Monthly Revenue",
      value: `$${stats?.monthlyRevenue?.toLocaleString() || 0}`,
      icon: CurrencyDollarIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Overview of your platform's performance and key metrics
            </p>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {statCards.map((stat) => (
              <div
                key={stat.name}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                          <div className="ml-2 flex items-baseline text-sm font-semibold">
                            {stat.changeType === "positive" ? (
                              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                            )}
                            <span
                              className={`ml-1 ${
                                stat.changeType === "positive"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {stat.change}
                            </span>
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {quickStats.map((stat) => (
              <div
                key={stat.name}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-md ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="text-center py-12">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No recent activity
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Activity will appear here as users interact with the platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
