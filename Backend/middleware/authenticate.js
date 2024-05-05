const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    console.log("Getting token from request header...");
    console.log("Authorization header:", req.headers.authorization);
    
    const token = req.headers.authorization.split(" ")[1];
    console.log("Token extracted from header:", token);

    console.log("Verifying token...");
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    console.log(process.env.JWT_TOKEN)
    console.log("Token verified successfully.");
    
    console.log("Decoded user data:", decoded);
    req.userData = decoded;
    console.log("Decoded user data:", req.userData);
    
    next();
  } catch (error) {
    console.error("Error occurred during authentication:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        message: "Token expired!",
      });
    } else {
      return res.status(401).json({
        message: "Authentication failed!",
      });
    }
  }
};


module.exports = authenticate;
// module.exports = specialToken;
