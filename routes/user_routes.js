// users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../model/user'); // Adjust the path accordingly


const secretKey = process.env.SECRET_KEY 

// Get all users
router.get("/getusers", (req, res) => {
    user.find({})
        .then(result => {
            res.json(result)
        })
})

// User registration and sign up
router.post("/signup", async (req, res) => {

    const pass = req.body.password
    const hassp = await bcrypt.hash(pass, 10)
    const email = req.body.email
    const username = req.body.username

    const body = {
        email: email,
        name: req.body.name,
        lname: req.body.lname,
        password: hassp,
        username: username
    }

    const findmail = await user.findOne({ email, username })

    if (findmail) {
        res.json({ message: "user already existed" })
    }

    else {
        user.create(body)
        res.json({ message: "user created" })
    }
})

// User login
router.post("/login", async (req, res) => {
    try {
        const findu = await user.findOne({ email: req.body.email })
        if (!findu) {
            res.json({ message: "404 error" })
        }
        const vpass = await bcrypt.compare(req.body.password, findu.password)
        if (!vpass) {
            res.json({ message: "invalid cridential" })
        } else {
            const token = jwt.sign({ userId: findu._id, email: findu.email }, secretKey, { expiresIn: '1h' });
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000, // milliseconds
                secure: true,
                sameSite: 'strict',
            });
            res.json({ message: "loged in", token });
        }
    } catch (error) {
        res.json({ message: "an error orcoured" })
        console.error(error);
        res.status(500).json({ message: "Login error" });
    }

})

module.exports = router;
