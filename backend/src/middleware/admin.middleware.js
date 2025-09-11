// Admin middleware to check if user is admin
export const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ 
      message: "Access denied. Admin privileges required." 
    });
  }
  next();
};

// Check if user is blocked
export const checkBlocked = (req, res, next) => {
  if (req.user && req.user.isBlocked) {
    return res.status(403).json({ 
      message: "Your account has been blocked. Please contact support." 
    });
  }
  next();
};
