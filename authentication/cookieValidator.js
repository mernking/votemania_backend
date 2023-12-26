// middleware.js
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY 

// Middleware function to check for a valid access token
const checkAccessToken = (req, res, next) => {
    const accessToken = req.cookies.token;

    if (!accessToken) {
        return res.status(400).json({ message: "No access token found" });
    }

    try {
        const decodedToken = jwt.verify(accessToken, secretKey);

        if (decodedToken) {
            // Attach the decoded token to the request for further use
            req.decodedToken = decodedToken;
            next(); // Continue to the next middleware or route handler
        } else {
            return res.status(400).json({ message: "Bad token" });
        }
    } catch (error) {
        return res.status(400).json({ message: "Invalid token", error: error.message });
    }
};

module.exports =
    checkAccessToken
    ;
