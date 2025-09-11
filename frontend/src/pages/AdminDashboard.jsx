import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAdminStats, 
  getAllUsersAdmin, 
  toggleBlockUser, 
  updateUserRole, 
  deleteUserAdmin 
} from "../lib/adminApi";
import {
  UsersIcon,
  UserCheckIcon,
  UserXIcon,
  ShieldIcon,
  TrendingUpIcon,
  MessageSquareIcon,
  SearchIcon,
  FilterIcon,
  MoreVerticalIcon,
  TrashIcon,
  BanIcon,
  CheckCircleIcon,
  XCircleIcon,
  CrownIcon
} from "lucide-react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Fetch admin statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: getAdminStats,
  });

  // Fetch users with pagination and filtering
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["adminUsers", currentPage, searchTerm, statusFilter],
    queryFn: () => getAllUsersAdmin({
      page: currentPage,
      limit: 10,
      search: searchTerm,
      status: statusFilter
    }),
  });

  // Block/Unblock user mutation
  const { mutate: toggleBlock, isPending: blockPending } = useMutation({
    mutationFn: toggleBlockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      toast.success("User status updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update user status");
    },
  });

  // Update role mutation
  const { mutate: updateRole, isPending: rolePending } = useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success("User role updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update user role");
    },
  });

  // Delete user mutation
  const { mutate: deleteUser, isPending: deletePending } = useMutation({
    mutationFn: deleteUserAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`card bg-base-200 shadow-md border-l-4 border-l-${color}`}>
      <div className="card-body p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-70">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-full bg-${color}/20`}>
            <Icon className={`size-6 text-${color}`} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {/* Stats Overview */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 w-full"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={UsersIcon}
            color="primary"
          />
          <StatCard
            title="Active Users"
            value={stats?.activeUsers || 0}
            icon={UserCheckIcon}
            color="success"
          />
          <StatCard
            title="Blocked Users"
            value={stats?.blockedUsers || 0}
            icon={UserXIcon}
            color="error"
          />
          <StatCard
            title="Recent Signups"
            value={stats?.recentUsers || 0}
            icon={TrendingUpIcon}
            color="info"
          />
        </div>
      )}

      {/* User Management */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-header p-6 border-b border-base-300">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShieldIcon className="size-6" />
            User Management
          </h2>
        </div>
        
        <div className="card-body p-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  className="input input-bordered flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  <SearchIcon className="size-4" />
                  Search
                </button>
              </div>
            </form>
            
            <div className="flex gap-2">
              <select
                className="select select-bordered"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          {usersLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-16 w-full"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData?.users?.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-full">
                              <img
                                src={user.profilePic}
                                alt={user.fullName}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold">{user.fullName}</div>
                            <div className="text-sm opacity-50">
                              {user.isOnboarded ? "Onboarded" : "Not Onboarded"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        {user.isBlocked ? (
                          <span className="badge badge-error">Blocked</span>
                        ) : (
                          <span className="badge badge-success">Active</span>
                        )}
                      </td>
                      <td>
                        {user.isAdmin ? (
                          <span className="badge badge-warning flex items-center gap-1">
                            <CrownIcon className="size-3" />
                            Admin
                          </span>
                        ) : (
                          <span className="badge badge-ghost">User</span>
                        )}
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="dropdown dropdown-left">
                          <label tabIndex={0} className="btn btn-ghost btn-sm">
                            <MoreVerticalIcon className="size-4" />
                          </label>
                          <ul
                            tabIndex={0}
                            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                          >
                            <li>
                              <button
                                onClick={() =>
                                  toggleBlock({
                                    userId: user._id,
                                    action: user.isBlocked ? "unblock" : "block",
                                  })
                                }
                                disabled={blockPending}
                                className={user.isBlocked ? "text-success" : "text-warning"}
                              >
                                {user.isBlocked ? (
                                  <>
                                    <CheckCircleIcon className="size-4" />
                                    Unblock
                                  </>
                                ) : (
                                  <>
                                    <BanIcon className="size-4" />
                                    Block
                                  </>
                                )}
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() =>
                                  updateRole({
                                    userId: user._id,
                                    isAdmin: !user.isAdmin,
                                  })
                                }
                                disabled={rolePending}
                                className="text-info"
                              >
                                <CrownIcon className="size-4" />
                                {user.isAdmin ? "Remove Admin" : "Make Admin"}
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Are you sure you want to delete ${user.fullName}? This action cannot be undone.`
                                    )
                                  ) {
                                    deleteUser(user._id);
                                  }
                                }}
                                disabled={deletePending || user.isAdmin}
                                className="text-error"
                              >
                                <TrashIcon className="size-4" />
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {usersData?.users?.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-lg font-semibold">No users found</p>
                  <p className="opacity-70">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {usersData && usersData.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="btn-group">
                <button
                  className="btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  «
                </button>
                <button className="btn btn-active">
                  Page {currentPage} of {usersData.totalPages}
                </button>
                <button
                  className="btn"
                  disabled={currentPage === usersData.totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
