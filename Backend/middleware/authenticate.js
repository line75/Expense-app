const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    console.log("getting tokens .......");
    // console.log(req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];
    console.log("half way through .............");
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log("gotten tokens .............");

    req.userData = decoded;
    // console.log(req.userData);
    next();
  } catch (error) {
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
