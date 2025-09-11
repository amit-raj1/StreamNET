import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import {
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  getPlatformStats,
  updateUserRole
} from "../controllers/admin.controller.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectRoute);

// Apply admin middleware to all routes
router.use(requireAdmin);

// Get platform statistics
router.get("/stats", getPlatformStats);

// Get all users with pagination and filtering
router.get("/users", getAllUsers);

// Block/Unblock user
router.put("/users/:id/block", toggleBlockUser);

// Update user role (admin/regular)
router.put("/users/:id/role", updateUserRole);

// Delete user
router.delete("/users/:id", deleteUser);

export default router;
