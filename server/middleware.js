const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-token"];
  if (!token)
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, "jwtKey");
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Middleware to check if user has the required role(s)
const authorizeRole = (requiredRoles) => (req, res, next) => {
  if (!req.user || !requiredRoles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Access denied. Insufficient permissions." });
  }
  next();
};

module.exports = { verifyJWT, authorizeRole };
