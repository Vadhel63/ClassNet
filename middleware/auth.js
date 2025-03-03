// // middleware/auth.js

// const jwt = require("jsonwebtoken");

// // Middleware to authenticate requests using JWT
// const auth = (req, res, next) => {
//   // Get token from the request header
//   const token = req.header("Authorization")?.split(" ")[1];

//   // Check if no token is present
//   if (!token) {
//     return res.status(401).json({ msg: "No token, authorization denied" });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is defined in your environment variables
//     req.userData = { userId: decoded.userId }; // Decode the token and attach the user data to the request object
//     next(); // Pass control to the next middleware or route handler
//   } catch (err) {
//     res.status(401).json({ msg: "Token is not valid" }); // If the token is invalid or expired
//   }
// };

// module.exports = auth;

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
