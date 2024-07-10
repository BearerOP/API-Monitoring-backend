const ApiLog = require("../models/api_logs_model");
const User = require("../models/user_model");
const axios = require("axios");

const addLogs = async (req, res) => {
  let logData = {};
  let startTime, endTime;

  try {
    const user = req.user;
    if (!user) {
      return {
        status: 401,
        message: "User Unauthorized",
      };
    }
    let { url, method } = req.body;

    // Validate the HTTP method
    if (
      !["get", "post", "put", "delete", "patch"].includes(method.toLowerCase())
    ) {
      return {
        success: false,
        message: "Invalid HTTP method",
      };
    }

    startTime = Date.now();

    // Perform the request
    const response = await axios({
      method: method.toLowerCase(),
      url: url,
    });

    endTime = Date.now();

    logData = {
      status: response.status,
      statusText: response.statusText,
      responseTime: endTime - startTime,
      timestamp: new Date(),
    };

    const existingLog = await ApiLog.findOne({
      user_id: user._id,
      url: url,
      method: method.toUpperCase(),
    });

    if (existingLog) {
      existingLog.logs.push(logData);
      await existingLog.save();
    } else {
      const newLog = new ApiLog({
        user_id: user._id,
        url,
        method: method.toUpperCase(),
        logs: [logData],
      });
      await newLog.save();
    }

    return {
      success: true,
      message: "Log added successfully",
    };
  } catch (error) {
    endTime = Date.now();

    logData = {
      status: error.response ? error.response.status : 500,
      statusText: error.message,
      responseTime: endTime - startTime,
      timestamp: new Date(),
    };

    try {
      const existingLog = await ApiLog.findOne({
        user_id: req.user._id,
        url: req.body.url,
        method: req.body.method.toUpperCase(),
      });

      if (existingLog) {
        existingLog.logs.push(logData);
        await existingLog.save();
      } else {
        const newLog = new ApiLog({
          user_id: req.user._id,
          url: req.body.url,
          method: req.body.method.toUpperCase(),
          logs: [logData],
        });
        await newLog.save();
      }

      return {
        success: true,
        message: "Log added successfully",
      };
    } catch (logError) {
      return {
        success: false,
        message: "Error saving log",
        error: logError.message,
      };
    }
  }
};

const getLogs = async (req, res) => {
  const logId = req.query.logId;

  try {
    const logs = await ApiLog.findById({ _id: logId });
    if (logs) {
      return {
        success: true,
        message: "Logs fetched successfully",
        data: logs,
      };
    } else {
      return {
        success: false,
        message: "Error fetching logs",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error fetching logs",
      error: error.message,
    };
  }
};
const getAllLogs = async (req, res) => {
  const user = req.user;
  try {
    const logs = await ApiLog.find({ user_id: user._id }).sort({
      timestamp: -1,
    });
    if (logs) {
      if (logs.length > 0) {
        return {
          success: true,
          message: "Logs fetched successfully",
          data: logs,
        };
      } else {
        return {
          success: true,
          message: "No logs found",
          data: [],
        };
      }
    } else {
      return {
        success: false,
        message: "Error fetching logs",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error fetching logs",
      error: error.message,
    };
  }
};

module.exports = {
  addLogs,
  getLogs,
  getAllLogs,
};
