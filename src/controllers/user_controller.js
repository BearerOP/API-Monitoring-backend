const {
  user_login,
  user_register,
  user_logout,
  user_profile,
  profile_update,
} = require("../services/user_validation_service.js");

exports.user_login = async (req, res) => {
  try {
    const data = await user_login(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);
    }
  } catch (error) {
    res.json({ Error: error });
  }
};

exports.user_register = async (req, res) => {
  try {
    const data = await user_register(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);
    }
  } catch (error) {
    res.json({ Error: error });
  }
};
exports.user_logout = async (req, res) => {
  try {
    const data = await user_logout(req, res);
    if (data.success) {
      res.status(200).json(data);
    }
  } catch (error) {
    console.log("Error: ", error);
  }
};

exports.user_profile = async (req, res) => {
  try {
    const data = await user_profile(req, res);
    if (data.success) {
      res.status(200).json(data);
    }
  } catch (error) {
    console.log("Error: ", error);
  }
};

exports.profile_update = async (req, res) => {
  try {
    const data = await profile_update(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);
    }
  } catch (error) {
    res.json({ Error: error });
  }
};
