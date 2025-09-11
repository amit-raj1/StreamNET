import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import {
  createSupportTicket,
  getUserSupportTickets,
  getSupportTicket,
  getAllSupportTickets,
  respondToTicket,
  updateTicketStatus,
} from "../controllers/support.controller.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectRoute);

// User routes
router.post("/tickets", createSupportTicket);
router.get("/tickets", getUserSupportTickets);
router.get("/tickets/:id", getSupportTicket);

// Admin routes
router.get("/admin/tickets", requireAdmin, getAllSupportTickets);
router.put("/admin/tickets/:id/respond", requireAdmin, respondToTicket);
router.put("/admin/tickets/:id/status", requireAdmin, updateTicketStatus);

export default router;
