import e, { Router } from "express";
import {
  getAllUsersDuplicate,
  createUser,
  loginUser,
  logoutUser,
  userInfo,
  editHobbies,
  getHobbies,
  getProfile,
} from "../controllers/userController";
import {
  authenticateToken,
  authorizeRole,
} from "../middlewares/authMiddleware";
import { refreshAccessToken } from "../controllers/refreshAccessToken";

const router = Router();

/**
 * @route GET /api/v1/users
 * @desc Get all users (excluding logged-in user and their friends)
 * @access Private
 */
router.get("/", getAllUsersDuplicate);

/**
 * @route POST /api/v1/users/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", createUser);

/**
 * @route POST /api/v1/users/login
 * @desc Login a user
 * @access Public
 */
router.post("/login", loginUser);

/**
 * @route POST /api/v1/users/protected
 * @desc Protected route
 * @access Private
 */
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

/**
 * @route GET /api/v1/users/admin
 * @desc Admin-only route
 * @access Private/Admin
 */
router.get("/admin", authenticateToken, authorizeRole("admin"), (req, res) => {
  res.json({ message: "Welcome, admin!" });
});

/**
 * @route POST /api/v1/users/refresh
 * @desc Refresh Token
 * @access Private
 */
router.post("/refresh", refreshAccessToken);

/**
 * @route POST /api/v1/users/refresh
 * @desc User Info
 * @access Private
 */
router.get("/info", authenticateToken, userInfo);

/**
 * @route POST /api/v1/users/logout
 * @desc Logout user
 * @access Private
 */
router.post("/logout", authenticateToken, logoutUser);

/**
 * @route GET /api/v1/friends/all
 * @desc Fetch all friends and pending friend requests
 * @access Private
 */

/**
 * @route POST /api/v1/users/hobbies
 * @desc Edit user hobbies
 * @access Private
 */
router.put("/hobbies", authenticateToken, editHobbies);

/**
 * @route POST /api/v1/users/hobbies
 * @desc Edit user hobbies
 * @access Private
 */
router.get("/hobbies", authenticateToken, getHobbies);

/**
 * @route POST /api/v1/users/profile
 * @desc Edit user hobbies
 * @access Private
 */
router.get("/profile", authenticateToken, getProfile);

export default router;
