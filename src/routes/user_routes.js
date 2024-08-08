const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");
const forgotPasswordLimiter = require("../../middleware/forgotPasswordLimiter.js");

const {
  user_login,
  user_register,
  user_logout,
  user_profile,
  profile_update,
  password_update,
  forgot_password,
  reset_password,
} = require("../controllers/user_controller.js");

router.post("/login", user_login);

router.post("/register", user_register);

router.post("/logout", user_auth, user_logout);

router.get("/profile", user_auth, user_profile);

router.put("/profile/update", user_auth, profile_update);

router.put("/profile/password/update", user_auth, password_update);

router.post("/forgot-password", forgotPasswordLimiter, forgot_password);

router.post("/reset-password", reset_password);

module.exports = router;
