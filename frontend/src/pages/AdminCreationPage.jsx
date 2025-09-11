import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { ShieldIcon, UserPlusIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AdminCreationPage = () => {
  const [adminForm, setAdminForm] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    adminSecretKey: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const createAdminMutation = useMutation({
    mutationFn: async (adminData) => {
      const response = await axiosInstance.post("/auth/create-admin", adminData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Admin account created successfully!");
      setAdminForm({
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
        adminSecretKey: "",
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create admin account");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!adminForm.email || !adminForm.fullName || !adminForm.password || !adminForm.adminSecretKey) {
      toast.error("All fields are required");
      return;
    }

    if (adminForm.password !== adminForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (adminForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    createAdminMutation.mutate(adminForm);
  };

  return (
    <div className="min-h-screen bg-base-100 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="card bg-base-200 shadow-2xl">
          <div className="card-header p-8 border-b border-base-300">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <ShieldIcon className="size-8 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-primary mb-2">Create Admin Account</h1>
              <p className="opacity-70">
                This is a secure endpoint to create administrator accounts for StreamNET
              </p>
            </div>
          </div>

          <div className="card-body p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Full Name *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Enter full name"
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
                  className="input input-bordered"
                  placeholder="admin@example.com"
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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input input-bordered w-full pr-12"
                    placeholder="Enter password (min 6 characters)"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Confirm Password *</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered"
                  placeholder="Confirm password"
                  value={adminForm.confirmPassword}
                  onChange={(e) => setAdminForm({ ...adminForm, confirmPassword: e.target.value })}
                  required
                />
              </div>

              {/* Admin Secret Key */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Admin Secret Key *</span>
                </label>
                <div className="relative">
                  <input
                    type={showSecretKey ? "text" : "password"}
                    className="input input-bordered w-full pr-12"
                    placeholder="Enter admin secret key"
                    value={adminForm.adminSecretKey}
                    onChange={(e) => setAdminForm({ ...adminForm, adminSecretKey: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                  >
                    {showSecretKey ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
                  </button>
                </div>
                <div className="label">
                  <span className="label-text-alt opacity-70">
                    This key is required to create admin accounts and should be kept secure
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-control mt-8">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={createAdminMutation.isPending}
                >
                  {createAdminMutation.isPending ? (
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
            </form>

            <div className="divider mt-8"></div>

            {/* Info Section */}
            <div className="space-y-4">
              <div className="alert alert-info">
                <ShieldIcon className="size-5" />
                <div>
                  <h3 className="font-bold">Security Information</h3>
                  <div className="text-sm">
                    • Admin secret key: <code className="bg-base-300 px-2 py-1 rounded text-xs">StreamNET_Admin_Secret_2025_Secure_Key_$#@!</code>
                    <br />
                    • Default admin already exists: <code className="bg-base-300 px-2 py-1 rounded text-xs">admin@streamnet.com</code>
                    <br />
                    • Password: <code className="bg-base-300 px-2 py-1 rounded text-xs">Amit@4321</code>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link to="/" className="btn btn-outline btn-sm">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreationPage;
