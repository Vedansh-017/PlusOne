// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: { 
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@nitj\.ac\.in$/, "Only nitj.ac.in emails are allowed"]
  },
  password: { 
    type: String,
    required: true
  },
  phone:{
    type: String,
  },
  verified: { 
    type: Boolean,
    default: false
  },
  otp: { 
    type: String, 
    default: null 
  },
  otpExpiresAt: { 
    type: Date, 
    default: null 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Clear OTP after verification automatically (optional)
userSchema.methods.clearOtp = function () {
  this.otp = null;
  this.otpExpiresAt = null;
  return this.save();
};

const UserModel = mongoose.models.user || mongoose.model('User', userSchema);

export default UserModel;
