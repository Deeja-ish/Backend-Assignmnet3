const bcrypt = require("bcryptjs");
const User = require("../models/User");


// SignUp process
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if(!name || !email || !password ){
            return res.status(400).json({message: `All Fields are required`})
        }

        const check = await User.findOne({ email })
        if(check){
            return res.status(401).json({message: `User already exist`})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name, 
            emai,
            password: hashedPassword
        });

        await newUser.save()

        res.status(201).json({message: `User created successfully!`})
    
    } catch (error) {
        console.error(`Error Creating User ${error}`)
        res.status(500).json({message: `Error during signup`})
    }

}

// Login Process
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if(!email || !password){
            return res.status(400).json({message: `Email and Password are required`})
        }

        const user = await User.findOne({ email })
        if(!user){
            return res.status(204).json({message: `User does not exist`})
        }

        const comparePassword = await bcrypt.compare(password, user.password)
        if(!comparePassword){
            res.status(204).json({message: `Incorrect Password`})
        }

        res.status(200).json({message: `Login sucessful`})
    } catch (error) {
        console.error(`Error during login ${error}`)
        res.status(500).json({message: `Internal Server Error`})
    }
}

// forgot password process
const forgotPassword = async (req, res) => {

    try {
        const { email } = req.body 
        if(!email){
            return res.status(400).json({message: `Email is required`})
        }

        const user = await User.findOne({ email }) 
        if(!user){
            return res.status(204).json({message: `User does not exist`})
        }
        //  created an otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // created an expiry time for otp
        const EXPIRY_TIME = 10
        const now = new Date();
        const otpExpiry = new Date(now.getTime() + EXPIRY_TIME * 60000);


        user.otp = otp
        user.otp_expiry = otpExpiry

        await user.save();
        return res.status(200).json({message: `OTP sent succesfully `})
    } catch (error) {
        console.error(`Error Sending OTP ${error}`)
        res.status(200).json({message: `Internal server error`})
    }
}

const verifyOtp = async (req, res) => {
    try{
        const {email, otp} = req.body

        if(!email || !otp){
            return res.status(400).json({message: `email and otp are required`})
        }

        const user = await User.findOne({ email })
        if(!user){
            return res.status(204).json({message: `User does not exist`})
        }

        if(user.otp != otp){
            return res.status(400).json({message: `OTP is required`})
        }
        const now = new Date();
        if(!user.otp || now > user.otp_expiry){
            user.otp = null
            user.otp_expiry = null
            await user.save()
            return res.status(200).json({message: `OTP has expired`})

        }   
        return res.status(200).json({message: `OTP has been verified `})
    } catch(error){
        console.error(`Error verifying otp ${error}`)
        res.status(500).json({message: `Internal server error`})
    }
}

const resetPassword = async (req, res) =>{
    try {
        const { email, otp, newPassword } = req.body
        if(!email || !otp || !newPassword){
            return res.status(400).json({message: `All fields are required`})
        }
        const user = await User.findOne({ email, otp })
        if(!user){
            return res.status(204).json({message: `User does not exist`})
        }
        if(user.otp !== otp){
            return res.status(400).json({message: `Invalid OTP`})
        }
        const now = new Date();
        if(now > user.otp_expiry){
            user.otp = null
            user.otp_expiry = null
            await user.save();
            return res.status(400).json({message: `OTP has expired`})
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword

        user.otp = null
        user.otp_expiry = null

        await user.save();
        return res.status(200).json({message: `Password reset successful`})
    } catch (error) {
        console.error(`Error resetting password ${error}`)
        res.status(500).json({message: `Internal server error`})
    }
}

// Resend OTP Process
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: `Email is required` });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: `User not found` });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const EXPIRY_TIME = 10; // 10 minutes
        const now = new Date();
        const otpExpiry = new Date(now.getTime() + EXPIRY_TIME * 60000);

        user.otp = otp;
        user.otp_expiry = otpExpiry;

        await user.save();

        return res.status(200).json({ message: `New OTP sent successfully` });
    } catch (error) {
        console.error(`Error Resending OTP ${error}`);
        res.status(500).json({ message: `Internal server error` });
    }
}



module.exports = {signup, login, forgotPassword, resetPassword, resendOtp, verifyOtp };