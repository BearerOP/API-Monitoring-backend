const {
  user_login,
  user_register,
  user_logout,
  user_profile,
  profile_update,
  password_update,
  forgot_password,
  reset_password
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

exports.password_update = async (req, res) => {
  try {
    const data = await password_update(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);
    }
  } catch (error) {
    res.json({ Error: error });
  }
};

exports.forgot_password = async (req, res) => {
  try {
    const data = await forgot_password(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);
    }
  } catch (error) {
    res.json({ Error: error });
  }
};

exports.reset_password = async (req, res) => {
  try {
    const data = await reset_password(req, res);
    if (data.success) {
      res.status(200).json(data);
    } else {
      res.status(403).json(data);
    }
  } catch (error) {
    res.json({ Error: error });
  }
};
