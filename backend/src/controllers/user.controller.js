import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import mongoose from "mongoose";

export async function searchUsers(req, res) {
  try {
    const { query } = req.query;
    const currentUserId = req.user.id;

    console.log("=== SEARCH DEBUG ===");
    console.log("Search query received:", query);
    console.log("Query type:", typeof query);
    console.log("Current user ID:", currentUserId);

    if (!query) {
      console.log("No query provided, returning error");
      return res.status(400).json({ message: "Search query is required" });
    }

    // First, let's see all users to debug
    const allUsers = await User.find({}).select('fullName isOnboarded isMasterAdmin');
    console.log("All users in database for search:", allUsers);

    // Search all users except master admin, include friends
    const users = await User.find({
      fullName: { $regex: query, $options: 'i' },
      _id: { $ne: currentUserId }, // Don't include current user in search results
      isOnboarded: true,
      $or: [
        { isMasterAdmin: { $ne: true } },
        { isMasterAdmin: { $exists: false } }
      ]
    }).select('fullName profilePic nativeLanguage learningLanguage');

    console.log("Search results count:", users.length);
    console.log("Search results:", users.map(u => ({ name: u.fullName, id: u._id.toString() })));

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in searchUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    
    console.log("Getting recommendations for user ID:", currentUserId);
    
    // Get current user to get friend list
    const currentUser = await User.findById(currentUserId).select('friends');
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("Current user found, friends count:", currentUser.friends.length);

    // Convert friend IDs to strings for comparison
    const friendIdsAsStrings = currentUser.friends.map(id => id.toString());
    console.log("Friend IDs (as strings):", friendIdsAsStrings);

    // Let's check what's in the database first
    const allUsersRaw = await User.find({}).select('fullName isOnboarded isMasterAdmin');
    console.log("All users raw data:", allUsersRaw);

    // Get all eligible users - simplified query
    const allUsers = await User.find({
      isOnboarded: true,
      $or: [
        { isMasterAdmin: { $ne: true } },
        { isMasterAdmin: { $exists: false } }
      ]
    }).select('fullName profilePic nativeLanguage learningLanguage bio location _id');

    console.log("All eligible users:", allUsers.map(u => ({ name: u.fullName, id: u._id.toString() })));

    // Filter out current user and friends
    const recommendedUsers = allUsers.filter(user => {
      const userIdString = user._id.toString();
      const isCurrentUser = userIdString === currentUserId;
      const isFriend = friendIdsAsStrings.includes(userIdString);
      
      console.log(`User: ${user.fullName}, ID: ${userIdString}, isCurrentUser: ${isCurrentUser}, isFriend: ${isFriend}`);
      
      return !isCurrentUser && !isFriend;
    });

    console.log("Final recommended users:", recommendedUsers.map(u => ({ name: u.fullName, id: u._id.toString() })));
    
    // Sort by newest and limit
    const sortedUsers = recommendedUsers
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20);
    
    res.status(200).json(sortedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUserById(req, res) {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select('fullName profilePic nativeLanguage learningLanguage')
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserById controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function checkIfFriends(req, res) {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (userId === currentUserId) {
      return res.status(400).json({ message: "Cannot check friendship status with yourself" });
    }

    const user = await User.findById(currentUserId).select("friends");
    const isFriend = user.friends.includes(userId);

    res.status(200).json({ isFriend });
  } catch (error) {
    console.error("Error in checkIfFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // prevent sending req to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if user is already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // check if a req already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request already exists between you and this user" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    // $addToSet: adds elements to an array only if they do not already exist.
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const unfriendUser = async (req, res) => {
  try {
    const myId = req.user._id;                // logged-in user
    const { id: friendId } = req.params;      // the friend to unfriend

    if (!friendId) {
      return res.status(400).json({ message: "Friend ID is required" });
    }

    if (myId.toString() === friendId.toString()) {
      return res.status(400).json({ message: "You cannot unfriend yourself" });
    }

    // 1. Remove friend from both users' lists
    await User.findByIdAndUpdate(myId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: myId } });

    // 2. Delete any accepted friend request record
    await FriendRequest.findOneAndDelete({
      $or: [
        { sender: myId, recipient: friendId },
        { sender: friendId, recipient: myId },
      ],
      status: "accepted",   // only delete if they were friends
    });

    // 3. Send response
    res.status(200).json({ message: "Successfully unfriended" });
  } catch (error) {
    console.error("Error in unfriendUser:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, bio, nativeLanguage, learningLanguage, location, profilePic } = req.body;

    // Validate required fields
    if (!fullName || !nativeLanguage || !learningLanguage) {
      return res.status(400).json({ message: "Full name, native language, and learning language are required" });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        bio,
        nativeLanguage,
        learningLanguage,
        location,
        profilePic,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export async function declineFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify the current user is the recipient
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to decline this request" });
    }

    // Delete the declined request
    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Friend request declined" });
  } catch (error) {
    console.log("Error in declineFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

