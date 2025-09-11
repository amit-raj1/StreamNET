import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Optional auth middleware - allows access if no master admin exists, requires auth otherwise
export const optionalMasterAdminAuth = async (req, res, next) => {
  try {
    // Check if master admin exists
    const existingMasterAdmin = await User.findOne({ isMasterAdmin: true });
    
    if (!existingMasterAdmin) {
      // No master admin exists, allow creation without authentication
      return next();
    }

    // Master admin exists, require authentication
    const token = req.cookies.jwt;
    
    if (!token) {
      return res.status(401).json({ 
        message: "Master admin already exists. Authentication required to create additional admins." 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (!user.isMasterAdmin) {
        return res.status(403).json({ 
          message: "Only the master administrator can create new admin accounts" 
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.log("Error in token verification:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.log("Error in optionalMasterAdminAuth middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
