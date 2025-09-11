import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

// Get all users (admin only)
export async function getAllUsers(req, res) {
  try {
    const { page = 1, limit = 10, search = "", status = "all" } = req.query;
    
    const query = {};
    
    // Add search filter
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add status filter
    if (status === "blocked") {
      query.isBlocked = true;
    } else if (status === "active") {
      query.isBlocked = false;
    }
    
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Block/Unblock user
export async function toggleBlockUser(req, res) {
  try {
    const { id: userId } = req.params;
    const { action } = req.body; // 'block' or 'unblock'
    
    if (!['block', 'unblock'].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Use 'block' or 'unblock'" });
    }
    
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Prevent blocking admin users
    if (user.isAdmin && action === 'block') {
      return res.status(400).json({ message: "Cannot block admin users" });
    }

    // Prevent blocking master admin
    if (user.isMasterAdmin) {
      return res.status(400).json({ message: "Cannot block the master administrator" });
    }
    
    user.isBlocked = action === 'block';
    await user.save();
    
    res.status(200).json({
      message: `User ${action}ed successfully`,
      user
    });
  } catch (error) {
    console.error("Error in toggleBlockUser:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Delete user (admin only)
export async function deleteUser(req, res) {
  try {
    const { id: userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Prevent deleting admin users
    if (user.isAdmin) {
      return res.status(400).json({ message: "Cannot delete admin users" });
    }

    // Prevent deleting master admin
    if (user.isMasterAdmin) {
      return res.status(400).json({ message: "Cannot delete the master administrator" });
    }
    
    // Remove user from friends lists
    await User.updateMany(
      { friends: userId },
      { $pull: { friends: userId } }
    );
    
    // Delete all friend requests involving this user
    await FriendRequest.deleteMany({
      $or: [
        { sender: userId },
        { recipient: userId }
      ]
    });
    
    // Delete the user
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get platform statistics
export async function getPlatformStats(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isBlocked: false });
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const onboardedUsers = await User.countDocuments({ isOnboarded: true });
    const totalFriendRequests = await FriendRequest.countDocuments();
    const pendingRequests = await FriendRequest.countDocuments({ status: "pending" });
    
    // Get user registration trends (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    res.status(200).json({
      totalUsers,
      activeUsers,
      blockedUsers,
      onboardedUsers,
      totalFriendRequests,
      pendingRequests,
      recentUsers
    });
  } catch (error) {
    console.error("Error in getPlatformStats:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update user role (make admin/remove admin)
export async function updateUserRole(req, res) {
  try {
    const { id: userId } = req.params;
    const { isAdmin } = req.body;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent changing master admin role
    if (user.isMasterAdmin) {
      return res.status(400).json({ message: "Cannot change master administrator role" });
    }

    // Only master admin can promote users to admin
    if (isAdmin && !req.user.isMasterAdmin) {
      return res.status(403).json({ message: "Only master admin can promote users to admin" });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true }
    ).select("-password");
    
    res.status(200).json({
      message: `User role updated successfully`,
      user: updatedUser
    });
  } catch (error) {
    console.error("Error in updateUserRole:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
