import { Request, Response } from "express";
import User from "../models/User";
import logger from "../utils/logger";

// Fetch all users excluding the logged-in user and their friends
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user.id;

    const loggedInUser = await User.findById(loggedInUserId).populate(
      "friends"
    );

    if (!loggedInUser) {
      return res.status(404).json({ message: "Logged-in user not found" });
    }

    const excludedIds = [
      loggedInUserId,
      ...loggedInUser.friends.map((friend: any) => friend._id.toString()),
    ];

    const users = await User.find(
      { _id: { $nin: excludedIds } },
      { password: 0 }
    );

    res.status(200).json(users);
  } catch (err: any) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Send a friend request to another user
export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const senderId = req.user.id;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ message: "Recipient ID is required" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (recipient.friends.includes(senderId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }

    if (recipient.pendingRequests.includes(senderId)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    recipient.pendingRequests.push(senderId);
    await recipient.save();

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (err: any) {
    console.error("Error sending friend request:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch all pending friend requests for the logged-in user
export const getPendingRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate(
      "pendingRequests",
      "name email"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ pendingRequests: user.pendingRequests });
  } catch (err: any) {
    console.error("Error fetching pending requests:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Respond to a friend request
export const respondToFriendRequest = async (req: Request, res: Response) => {
  const { requesterId, action } = req.body;

  try {
    if (!requesterId || !["confirm", "ignore"].includes(action)) {
      return res.status(400).json({ message: "Invalid requesterId or action" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.pendingRequests.includes(requesterId)) {
      return res
        .status(400)
        .json({ message: "No pending friend request from this user" });
    }

    if (action === "confirm") {
      user.friends.push(requesterId);
      const requester = await User.findById(requesterId);
      if (requester) {
        requester.friends.push(user._id);

        requester.pendingRequests = requester.pendingRequests.filter(
          (id: any) => id.toString() !== user._id.toString()
        );

        await requester.save();
      }
    }

    user.pendingRequests = user.pendingRequests.filter(
      (id: any) => id.toString() !== requesterId
    );
    await user.save();

    res
      .status(200)
      .json({ message: `Friend request ${action}ed successfully` });
  } catch (err: any) {
    console.error("Error responding to friend request:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch all friends of the logged-in user
export const getFriends = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("friends", "name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ friends: user.friends });
  } catch (err: any) {
    console.error("Error fetching friends:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
