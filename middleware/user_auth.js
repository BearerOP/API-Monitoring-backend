require("dotenv").config();
const jwt = require("jsonwebtoken");
const user_model = require("../src/models/user_model.js");

// Middleware for handling auth
async function user_auth(req, res, next) {
  // Implement user auth logic
  try {
    const token = req.cookies.token;
    // const tokenHead = req.headers["authorization"];
    // console.log(tokenHead);

    // const token = tokenHead.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "User is not logged in" });
    }
    const jwtPassword = process.env.SECRET_KEY;
    const decode = await jwt.verify(token, jwtPassword);
    let user = await user_model
      .findOne({ _id: decode.id })
      .select("-password -auth_key ")
      .exec();
    if (!user) return res.status(403).json({ msg: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return {
        message: error.message || "Internal server error",
        success: false,
      };
  }
}

module.exports = user_auth;