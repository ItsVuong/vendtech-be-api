const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader;
  if (!token) return res.status(401).json({ error: "user not allowed to perform this action, login to continue" });
  const accessToken = process.env.ACCESS_TOKEN_SECRET;
  jwt.verify(token, accessToken, (err, user) => {
    if (err) return res.status(403).json({ error: "user not allowed to perform this action, login to continue" });
    req.user = user;
    next();
  });
}

module.exports = {
    authenticate
}