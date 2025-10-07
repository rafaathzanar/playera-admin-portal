import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Venue, VenueFilters } from "../types";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

const Venues: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<VenueFilters>({
    page: 0,
    size: 20,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    fetchVenues();
  }, [filters]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const queryFilters = {
        ...filters,
        search: searchTerm || undefined,
        venueType: selectedType || undefined,
        isActive: selectedStatus ? selectedStatus === "active" : undefined,
      };
      const data = await api.getVenues(queryFilters);
      setVenues(data.content || data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch venues");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters({ ...filters, page: 0 });
    fetchVenues();
  };

  const handleApproveVenue = async (venueId: number, approved: boolean) => {
    try {
      await api.approveVenue(
        venueId,
        approved,
        approved ? "Venue approved by admin" : "Venue rejected by admin"
      );
      fetchVenues(); // Refresh the list
    } catch (err: any) {
      setError(err.message || "Failed to update venue approval status");
    }
  };

  const handleStatusChange = async (venueId: number, isActive: boolean) => {
    try {
      await api.updateVenueStatus(venueId, isActive, "Status updated by admin");
      fetchVenues(); // Refresh the list
    } catch (err: any) {
      setError(err.message || "Failed to update venue status");
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "INDOOR":
        return "bg-blue-100 text-blue-800";
      case "OUTDOOR":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getApprovalBadgeColor = (isApproved: boolean) => {
    return isApproved
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Venue Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage all venues on the platform
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search venues..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="INDOOR">Indoor</option>
                  <option value="OUTDOOR">Outdoor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Venues Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Venue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approval
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {venues.map((venue) => (
                    <tr key={venue.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <BuildingOfficeIcon className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {venue.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {venue.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {venue.owner?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {venue.owner?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadgeColor(
                            venue.venueType
                          )}`}
                        >
                          {venue.venueType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                            venue.isActive
                          )}`}
                        >
                          {venue.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getApprovalBadgeColor(
                            venue.isApproved
                          )}`}
                        >
                          {venue.isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(venue.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {!venue.isApproved && (
                            <>
                              <button
                                onClick={() =>
                                  handleApproveVenue(venue.id, true)
                                }
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                              >
                                <CheckIcon className="h-3 w-3 mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleApproveVenue(venue.id, false)
                                }
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                              >
                                <XMarkIcon className="h-3 w-3 mr-1" />
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() =>
                              handleStatusChange(venue.id, !venue.isActive)
                            }
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md ${
                              venue.isActive
                                ? "text-red-700 bg-red-100 hover:bg-red-200"
                                : "text-green-700 bg-green-100 hover:bg-green-200"
                            }`}
                          >
                            {venue.isActive ? "Suspend" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {venues.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-500">No venues found</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Venues;
