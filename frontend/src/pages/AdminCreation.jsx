import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ShieldCheckIcon, UserPlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import useAuthUser from "../hooks/useAuthUser";

const AdminCreation = () => {
  const { authUser } = useAuthUser();
  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
    fullName: "",
    adminSecretKey: "",
  });

  // Check if current user is master admin
  const isMasterAdmin = authUser?.isMasterAdmin;

  const { mutate: createAdminMutation, isPending } = useMutation({
    mutationFn: async (adminData) => {
      const response = await axiosInstance.post("/auth/create-admin", adminData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Admin account created successfully!");
      setAdminForm({
        email: "",
        password: "",
        fullName: "",
        adminSecretKey: "",
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create admin account");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminForm.email || !adminForm.password || !adminForm.fullName || !adminForm.adminSecretKey) {
      toast.error("Please fill in all required fields");
      return;
    }
    createAdminMutation(adminForm);
  };

  // If user is not authenticated or not master admin, show access denied
  if (!authUser) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-base-content/70 mb-6">You must be logged in to access this page.</p>
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!isMasterAdmin) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <div className="text-center">
          <ShieldCheckIcon className="size-16 text-error mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-base-content/70 mb-6">
            Only the Master Administrator can create new admin accounts.
          </p>
          <Link to="/" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-header p-6 border-b border-base-300">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <UserPlusIcon className="size-8 text-primary" />
              Create Admin Account
            </h1>
            <p className="text-base-content/70 mt-2">
              Create a new administrator account with access to admin features.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card-body p-6 space-y-4">
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Name *</span>
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                className="input input-bordered"
                value={adminForm.fullName}
                onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Address *</span>
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                className="input input-bordered"
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password *</span>
              </label>
              <input
                type="password"
                placeholder="Enter secure password"
                className="input input-bordered"
                value={adminForm.password}
                onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                required
                minLength={6}
              />
              <label className="label">
                <span className="label-text-alt">Password must be at least 6 characters</span>
              </label>
            </div>

            {/* Admin Secret Key */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Admin Secret Key *</span>
              </label>
              <input
                type="password"
                placeholder="Enter the master admin secret key"
                className="input input-bordered"
                value={adminForm.adminSecretKey}
                onChange={(e) => setAdminForm({ ...adminForm, adminSecretKey: e.target.value })}
                required
              />
              <label className="label">
                <span className="label-text-alt text-warning">
                  🔐 Required for security verification. Contact master admin if needed.
                </span>
              </label>
            </div>

            {/* Security Notice */}
            <div className="alert alert-warning">
              <ShieldCheckIcon className="size-5" />
              <div>
                <h3 className="font-bold">🛡️ Admin Creation Rules</h3>
                <div className="text-sm space-y-1">
                  <p>• <strong>Master Admin Secret Key</strong> is required for all admin creation</p>
                  <p>• Only <strong>ONE Master Admin</strong> can exist in the system</p>
                  <p>• Master Admin can create <strong>Regular Admins</strong> (not master admins)</p>
                  <p>• New admins will have standard admin privileges</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Creating Admin...
                  </>
                ) : (
                  <>
                    <UserPlusIcon className="size-5" />
                    Create Admin Account
                  </>
                )}
              </button>
            </div>

            {/* Back Link */}
            <div className="text-center mt-4">
              <Link to="/admin" className="link link-primary">
                ← Back to Admin Dashboard
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreation;
