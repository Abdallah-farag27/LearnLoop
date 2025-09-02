const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: "You must login first" });
    }

    // Extract token from "Bearer <token>" format
    const token = authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : authorization;

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    req.role = decoded.role;
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    res.status(403).json({ message: "Invalid token" });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};
