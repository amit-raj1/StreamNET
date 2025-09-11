import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkBlocked } from "../middleware/admin.middleware.js";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  searchUsers,
  sendFriendRequest,
  unfriendUser,
  updateProfile,
  checkIfFriends,
  getUserById
} from "../controllers/user.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

// apply block check to all routes
router.use(checkBlocked);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.get("/search", searchUsers);
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);
router.get("/check-friends/:userId", checkIfFriends);
router.get("/:userId", getUserById);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.put("/friend-request/:id/decline", declineFriendRequest);

router.delete("/unfriend/:id", unfriendUser);
router.put("/profile", updateProfile);

export default router;
