import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import {
  sendFriendRequest,
  getPendingRequests,
  respondToFriendRequest,
  getFriends,
} from "../controllers/friendsController";
import logger from "../utils/logger";

const router = Router();

/**
 * @route POST /api/v1/friends/request
 * @desc Send a friend request
 * @access Private
 */
router.post("/request", authenticateToken, sendFriendRequest);

/**
 * @route GET /api/v1/friends/requests
 * @desc Get pending friend requests
 * @access Private
 */
router.get("/requests", authenticateToken, getPendingRequests);

/**
 * @route POST /api/v1/friends/respond
 * @desc Respond to a friend request
 * @access Private
 */
router.post("/respond", authenticateToken, respondToFriendRequest);

/**
 * @route GET /api/v1/friends
 * @desc Get confirmed friends
 * @access Private
 */
router.get("/", authenticateToken, getFriends);

router.get("/all", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("pendingRequests", "name email")
      .populate("friends", "name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      pendingRequests: user.pendingRequests,
      friends: user.friends,
    });
  } catch (err: any) {
    console.error("Error fetching friends:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
