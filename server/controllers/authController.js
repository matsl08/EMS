// * Authentication Controller
// @ file: Handles user authentication operations

import { User } from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  storeRefreshToken,
  verifyRefreshToken,
  blacklistToken,
} from "../utils/tokenManagement.js";
import { comparePassword, hashPassword } from "../utils/passwordManagement.js";

// * Authentication Controllers

// ? Login user
export const login = async (req, res) => {
  try {
    const { id, password, role } = req.body;

    // * Find user by ID and role based on the role type
    const query = {};
    switch (role) {
      case "student":
        query.studentId = id;
        break;
      case "teacher":
        query.facultyId = id;
        break;
      case "admin":
        query.adminId = id;
        break;
      default:
        return res.status(400).json({ message: "Invalid role" });
    }
    query.role = role;

    // * Find user
    const user = await User.findOne(query);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // * Verify password with hash
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // * Generate access and refresh tokens
    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
      studentId: user.studentId,
      facultyId: user.facultyId,
      adminId: user.adminId,
      adminPosition: user.adminInfo?.position,
    });

    const refreshToken = generateRefreshToken(user._id);

    // * Store refresh token in Redis
    await storeRefreshToken(user._id, refreshToken); // * Prepare user data based on role
    const userData = {
      id: user._id,
      name: user.name,
      role: user.role,
      idNumber: id,
    };

    // * Add role-specific data
    if (user.role === "admin" && user.adminInfo) {
      userData.position = user.adminInfo.position;
    } else if (user.role === "teacher") {
      userData.department = user.department;
    } else if (user.role === "student") {
      userData.programCode = user.programCode;
    }

    res.json({
      message: "Login successful",
      token: accessToken, // Changed from accessToken to token to match client expectation
      refreshToken,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Get current user
export const getMe = async (req, res) => {
  try {
    // ! req.user is set by the auth middleware
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Logout user
export const logout = async (req, res) => {
  try {
    // * Get token from authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    // * Blacklist the token
    await blacklistToken(token);

    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ? Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // * Verify refresh token
    const decoded = await verifyRefreshToken(refreshToken);

    // * Generate new access token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
      studentId: user.studentId,
      facultyId: user.facultyId,
      adminId: user.adminId,
    });

    res.json({
      message: "Token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    if (
      error.message === "Invalid refresh token" ||
      error.message === "Refresh token expired"
    ) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// ? Update user password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // * Validate request body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    // * Get user from database (with password)
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // * Verify current password
    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // * Hash new password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    // * Blacklist all existing tokens for this user
    const currentToken = req.headers.authorization?.split(" ")[1];
    if (currentToken) {
      await blacklistToken(currentToken);
    }

    // * Generate new tokens
    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
      studentId: user.studentId,
      facultyId: user.facultyId,
      adminId: user.adminId,
    });

    const refreshToken = generateRefreshToken(user._id);
    await storeRefreshToken(user._id, refreshToken);

    res.json({
      message: "Password updated successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
