const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  auth_key: {
    type: String,
    default: null,
  },
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExp: {
    type: Date,
    default: null,
  },
  profilePicture:{
    type: String,
    default: 'https://firebasestorage.googleapis.com/v0/b/theslugproject.appspot.com/o/default-profile.png?alt=media&token=029f4f81-501f-4d9d-9c2d-2148ffe240f8'
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
