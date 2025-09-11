import SupportTicket from "../models/SupportTicket.js";
import User from "../models/User.js";

// Create support ticket
export async function createSupportTicket(req, res) {
  try {
    const { category, subject, message, priority } = req.body;
    const userId = req.user.id;

    // Validation
    if (!category || !subject || !message) {
      return res.status(400).json({ 
        message: "Category, subject, and message are required" 
      });
    }

    const ticket = await SupportTicket.create({
      user: userId,
      category,
      subject,
      message,
      priority: priority || "medium",
    });

    await ticket.populate("user", "fullName email profilePic");

    res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error creating support ticket:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get user's support tickets
export async function getUserSupportTickets(req, res) {
  try {
    const userId = req.user.id;
    
    const tickets = await SupportTicket.find({ user: userId })
      .populate("user", "fullName email profilePic")
      .populate("respondedBy", "fullName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Error fetching user support tickets:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get single support ticket
export async function getSupportTicket(req, res) {
  try {
    const { id: ticketId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    const ticket = await SupportTicket.findById(ticketId)
      .populate("user", "fullName email profilePic")
      .populate("respondedBy", "fullName");

    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    // Only allow user to see their own tickets or admin to see all
    if (ticket.user._id.toString() !== userId && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("Error fetching support ticket:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Admin: Get all support tickets
export async function getAllSupportTickets(req, res) {
  try {
    const { page = 1, limit = 10, status = "all", priority = "all" } = req.query;
    
    const query = {};
    
    if (status !== "all") {
      query.status = status;
    }
    
    if (priority !== "all") {
      query.priority = priority;
    }
    
    const tickets = await SupportTicket.find(query)
      .populate("user", "fullName email profilePic")
      .populate("respondedBy", "fullName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await SupportTicket.countDocuments(query);
    
    res.status(200).json({
      success: true,
      tickets,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching all support tickets:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Admin: Respond to support ticket
export async function respondToTicket(req, res) {
  try {
    const { id: ticketId } = req.params;
    const { response, status } = req.body;
    const adminId = req.user.id;

    if (!response) {
      return res.status(400).json({ message: "Response is required" });
    }

    const ticket = await SupportTicket.findByIdAndUpdate(
      ticketId,
      {
        response,
        status: status || "resolved",
        respondedBy: adminId,
        respondedAt: new Date(),
      },
      { new: true }
    )
      .populate("user", "fullName email profilePic")
      .populate("respondedBy", "fullName");

    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    res.status(200).json({
      success: true,
      message: "Response sent successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error responding to ticket:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Admin: Update ticket status only
export async function updateTicketStatus(req, res) {
  try {
    const { id: ticketId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!["open", "in_progress", "resolved", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const ticket = await SupportTicket.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true }
    )
      .populate("user", "fullName email profilePic")
      .populate("respondedBy", "fullName");

    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    res.status(200).json({
      success: true,
      message: "Ticket status updated successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error updating ticket status:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
