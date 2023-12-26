// protected.js
const express = require('express');
const router = express.Router();
const checkAccessToken = require('./cookieValidator'); // Adjust the path accordingly



// Protected route
router.get('/protected', checkAccessToken, (req, res) => {
    res.json({ message: 'You have access to the protected route!', user: req.decodedToken });
});

module.exports = router;
