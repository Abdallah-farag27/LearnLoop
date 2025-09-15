const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization.split(" ")[1];
    if (!authorization) {
      return res.status(401).json({ message: "You must login first" });
    }
    const decoded = await promisify(jwt.verify)(authorization, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

exports.HasPersmissions = (req, res, next) => {
  if (req.user.admin) {
    return next();
  }
  return res.status(403).json({ message: "You Do not have Permission!" });
};
