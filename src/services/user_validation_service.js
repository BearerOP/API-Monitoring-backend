const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
      return res.status(403).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY);
    if (!token) {
      return res.json({ message: " Token generation failed" });
    }

    const authKeyInsertion = await User.findOneAndUpdate(
      { _id: existingUser._id },
      { auth_key: token },
      { new: true }
    );

    if (!authKeyInsertion) {
      return res.json({ message: "Token updation failed" });
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

module.exports = {
  user_login,
  user_register,
  user_logout,
  user_profile,
  profile_update,
  password_update,
};