const express = require("express")
const { login, signup, forgotPassword, resetPassword, resendOtp, verifyOtp } = require("../controllers/UserController")
const router = express.Router()

router.post("/login", login )
router.post("/signup", signup)
router.put("/forgot-password", forgotPassword)
router.put("/reset-password", resetPassword)
router.get("/resendOtp", resendOtp)
router.get("/verifyOtp", verifyOtp)

module.exports = router;