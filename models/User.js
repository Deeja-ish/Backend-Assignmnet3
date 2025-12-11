const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, rquired: true, unique: true},
    password: {type: String, required: true, unique: true},
    otp: {type: String, default: null},
    otp_expiry: {type: Date, default: null}
}, { timestamps: true})

const User = mongoose.model("User", userSchema)

module.exports = User;