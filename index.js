require('dotenv').config({ path: '../.env' });
const express = require("express")
const cors = require("cors")
const cookieParser = require('cookie-parser')
const electionword = require("./routes/election_routes")
const mongoose = require("mongoose")
const usersRoutes = require('./routes/user_routes'); // Adjust the path accordingly
const protectedRoutes = require('./authentication/protected'); // Adjust the path accordingly
const port = process.env.PORT

const app = express()

mongoose.connect("mongodb+srv://test:david@cluster0.bx4wlrw.mongodb.net/votemania")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });


app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173', // Replace with the actual origin of your frontend application
    credentials: true, // Enable credentials (cookies)
}));
app.use(cookieParser())


app.use("/api", usersRoutes)
app.use("/api", protectedRoutes)
app.use("/api", electionword)



app.listen(port, () => {
    console.log(`am 👿👿👿👿👿 alive`)
})