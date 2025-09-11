// Master admin middleware to check if user is master admin
export const requireMasterAdmin = (req, res, next) => {
  if (!req.user || !req.user.isMasterAdmin) {
    return res.status(403).json({ 
      message: "Access denied. Master admin privileges required." 
    });
  }
  next();
};
