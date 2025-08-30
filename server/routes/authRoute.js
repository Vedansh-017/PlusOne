import express from "express";
import { registerUser, loginUser, verifyOtp } from "../controllers/authcontroller.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);       // Step 1 → sends OTP
userRouter.post("/verify-otp", verifyOtp);  // Step 2 → verify OTP & login

export default userRouter;
