// Middleware to verify the special token
const specialToken = (req, res, next) => {
    const specialToken = req.headers['x-special-token'];
    if (specialToken === process.env.TOKEN) {
        next(); // Token is valid, proceed to the next middleware or route handler
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = specialToken;
