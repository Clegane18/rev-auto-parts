const jwt = require("jsonwebtoken");
const { secretKey } = require("../utils/passwordUtils");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token." });

    req.user = decoded;
    next();
  });
};

module.exports = { SecretKey: secretKey, authenticateToken };
