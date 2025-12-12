const mongoose = require("mongoose");
require("dotenv").config();
const express = require('express')
const app = express()
const morgan = require("morgan");
const connectDB = require("./config/db");
const port = process.env.PORT || 3000;
const userRoutes = require("./routes/userRoutes");

// Middleware
app.use(express.json());
app.use(morgan("dev"));

connectDB()

// Routes
app.use("/api/users", userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})