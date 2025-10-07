import React, { useState, useEffect } from "react";
import api from "../services/api";
import { User, UserFilters } from "../types";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  UserPlusIcon,
  UserMinusIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

const VenueOwners: React.FC = () => {
  const [venueOwners, setVenueOwners] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<UserFilters>({
    page: 0,
    size: 20,
    role: "VENUE_OWNER",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    fetchVenueOwners();
  }, [filters]);

  const fetchVenueOwners = async () => {
    try {
      setLoading(true);
      const queryFilters = {
        ...filters,
        search: searchTerm || undefined,
        isActive: selectedStatus ? selectedStatus === "active" : undefined,
      };
      const data = await api.getVenueOwners(queryFilters);
      setVenueOwners(data.content || data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch venue owners");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters({ ...filters, page: 0 });
    fetchVenueOwners();
  };

  const handleStatusChange = async (ownerId: number, isActive: boolean) => {
    try {
      await api.updateVenueOwnerStatus(
        ownerId,
        isActive,
        "Status updated by admin"
      );
      fetchVenueOwners(); // Refresh the list
    } catch (err: any) {
      setError(err.message || "Failed to update venue owner status");
    }
  };

  const handleApproveOwner = async (ownerId: number, approved: boolean) => {
    try {
      await api.approveVenueOwner(
        ownerId,
        approved,
        approved
          ? "Venue owner approved by admin"
          : "Venue owner rejected by admin"
      );
      fetchVenueOwners(); // Refresh the list
    } catch (err: any) {
      setError(err.message || "Failed to update venue owner approval status");
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
              Venue Owner Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage venue owners and their applications
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search venue owners..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
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

          {/* Venue Owners Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
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
                  {venueOwners.map((owner) => (
                    <tr key={owner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <BuildingOfficeIcon className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {owner.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {owner.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {owner.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {owner.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                            owner.isActive
                          )}`}
                        >
                          {owner.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getApprovalBadgeColor(
                            true
                          )}`}
                        >
                          Approved
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(owner.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                            <EyeIcon className="h-3 w-3 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(owner.id, !owner.isActive)
                            }
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md ${
                              owner.isActive
                                ? "text-red-700 bg-red-100 hover:bg-red-200"
                                : "text-green-700 bg-green-100 hover:bg-green-200"
                            }`}
                          >
                            {owner.isActive ? (
                              <>
                                <UserMinusIcon className="h-3 w-3 mr-1" />
                                Suspend
                              </>
                            ) : (
                              <>
                                <UserPlusIcon className="h-3 w-3 mr-1" />
                                Activate
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {venueOwners.length === 0 && !loading && (
              <div className="text-center py-12">
                <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No venue owners found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Venue owners will appear here as they register.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueOwners;
