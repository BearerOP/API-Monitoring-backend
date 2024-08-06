const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/email_service");
const crypto = require("crypto");

const generateToken = (length) => {
  return crypto.randomBytes(length).toString("hex").substring(0, length);
};
const user_login = async (req, res) => {
  try {
    console.log("reached user login service");
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return {
        success: false,
        message: "Invalid email or not registered!",
      };
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }
    const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY);
    if (!token) {
      return {
        success: "false",
        message: " Token generation failed",
      };
    }

    const authKeyInsertion = await User.findOneAndUpdate(
      { _id: existingUser._id },
      { auth_key: token },
      { new: true }
    );

    if (!authKeyInsertion) {
      return { message: "Token updation failed" };
    }

    return {
      message: "User logged in successfully",
      success: true,
      token,
    };
  } catch (error) {
    console.log(error);
    return {
      message: error.message || "Internal server error",
      success: false,
    };
  }
};

const user_register = async (req, res) => {
  console.log("reached user sign up service");

  const { username, password, email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        message: "User already exists",
        success: false,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    if (newUser) {
      return {
        message: "User created successfully",
        success: true,
      };
    } else {
      return {
        message: "User creation failed",
        success: false,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      message: error.message || "Internal server error",
      success: false,
    };
  }
};

const user_logout = async (req, res) => {
  let user = req.user;
  try {
    const currentUser = await User.findOneAndUpdate(
      { _id: user._id },
      { auth_key: null }
    );
    res.user = null;
    res.clearCookie("token");
    if (currentUser) {
      return {
        success: true,
        message: "User logged out successfully",
      };
    } else {
      return {
        success: false,
        message: "User logout failed",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      message: error.message || "Internal server error",
      success: false,
    };
  }
};

const user_profile = async (req, res) => {
  console.log("reached user service");

  const user = req.user;
  try {
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      success: false,
      message: "An unexpected error occurred",
      error: error,
    };
  }
};

const profile_update = async (req, res) => {
  const user = req.user;
  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }
  const { username, email } = req.body;

  try {
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return {
          success: false,
          message: "Username already exists, try something else",
        };
      }
    }
    const updatedFields = {};
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;

    updatedFields.updated_at = new Date();

    let updatedData = await User.findByIdAndUpdate(user._id, updatedFields, {
      new: true,
    });
    if (!updatedData) {
      return {
        success: false,
        message: "User not found",
      };
    }
    return {
      success: true,
      message: "Profile updated successfully",
      data: updatedData,
    };
  } catch (err) {
    return {
      success: false,
      message: "An error occurred while updating the profile",
      error: err.message,
    };
  }
};

const password_update = async (req, res) => {
  const user = req.user;
  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const { new_password } = req.body;
  if (!new_password) {
    return {
      success: false,
      message: "Password is required",
    };
  }
  try {
    const userDetails = await User.findById(user._id);
    if (!userDetails) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    userDetails.password = hashedPassword;
    const savedDetail = await userDetails.save();

    if (!savedDetail) {
      return {
        success: false,
        message: "Password updation failed",
      };
    }

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: "An error occurred while updating the password",
      error: err.message,
    };
  }
};
const forgot_password = async (req, res) => {
  console.log('reached fp');
  
  let CLIENT_URL = "";
  if (process.env.ENVIRONMENT === "development") {
    CLIENT_URL = "http://localhost:5173";
  } else {
    CLIENT_URL = "https://up-status-xi.vercel.app";
  }

  const { email } = req.body;
  if (!email) {
    return {
      success: false,
      message: "Email is required",
    };
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const token = generateToken(8); // 8-character token
    await user.updateOne({
      resetToken: token,
      resetTokenExp: Date.now() + 3600000, // 1 hour expiry
    });

    const resetUrl = `${CLIENT_URL}/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Password Reset</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      margin: 0;
                      padding: 0;
                      background-color: #f4f4f4;
                  }
                  .container {
                      width: 100%;
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #ffffff;
                      border-radius: 8px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                      color: #333;
                  }
                  p {
                      color: #555;
                      line-height: 1.5;
                  }
                  .button {
                      display: inline-block;
                      padding: 15px 25px;
                      margin-top: 20px;
                      font-size: 16px;
                      color: #000;
                      background-color: #007bff;
                      text-decoration: none;
                      border-radius: 5px;
                      text-align: center;
                  }
                      a{
                      text-decoration: none;
                      color: #000;
                      }
                  .button:hover {
                      background-color: #0056b3;
                  }
                  .footer {
                      margin-top: 20px;
                      font-size: 14px;
                      color: #999;
                      text-align: center;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>Password Reset Request</h1>
                  <p>Hi there,</p>
                  <p>We received a request to reset your password. Click the button below to create a new password.</p>
                  <a href="${resetUrl}" class="button">Reset Password</a>
                  <p>If you did not request this change, please ignore this email.</p>
                  <p>Thank you,<br>The Team</p>
                  <div class="footer">
                      <p>&copy; ${new Date().getFullYear()} UpStatus. All rights reserved.</p>
                  </div>
              </div>
          </body>
          </html>
      `
  };

    await sendEmail(mailOptions);
    return {
      success: true,
      message: "Reset password link sent to your email",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred while sending the reset password link",
      error: error.message,
    };
  }
};

const reset_password = async (req, res) => {
  console.log('reset password reach');
  
  const { token, newPassword } = req.body;
  console.log(token,newPassword);
  
  if (!token || !newPassword) {
    return {
      success: false,
      message: "Token and new password are required",
    }
  }

  try {
    // Find the user with the provided reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() }, // Token must not be expired
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid or expired token",
      };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    await User.updateOne(
      { _id: user._id },
      {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
      }
    );
    return{
      success: true,
      message: "Password has been reset successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while resetting the password",
      error: error.message,
    };
  }
};

module.exports = {
  user_login,
  user_register,
  user_logout,
  user_profile,
  profile_update,
  password_update,
  forgot_password,
  reset_password,
};
