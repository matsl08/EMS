// * Authentication Middleware
// @ file: Middleware for protecting routes and handling authorization

import { verifyToken } from "../utils/tokenManagement.js";

// ? Protect routes - Verify JWT token
export const protect = async (req, res, next) => {
  try {
    // * Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];

    // * Verify token
    const decoded = await verifyToken(token);

    // * Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.message === "Token is blacklisted") {
      return res
        .status(401)
        .json({ message: "Session expired, please login again" });
    }
    res.status(401).json({ message: "Not authorized" });
  }
};

// ? Authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Not authorized to access this resource",
      });
    }
    next();
  };
};

// ? Authorize admin positions
export const authorizeAdminPosition = (position) => {
  return (req, res, next) => {
    if (
      req.user.role !== "admin" ||
      !req.user.adminId ||
      req.user.adminPosition !== position
    ) {
      return res.status(403).json({
        message: "Not authorized to access this resource",
      });
    }
    next();
  };
};
