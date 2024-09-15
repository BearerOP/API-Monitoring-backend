const ApiLog = require("../models/api_logs_model");
const axios = require("axios");

const addLogs = async (req, res) => {
  let logData = {};
  let startTime, endTime;
  const user = req.user;

  try {
    // if (!user) {
    //   return{
    //     success: false,
    //     message: "User Unauthorized",
    //   };
    // }

    let { url, method } = req.body;

    if (!["get", "post", "put", "delete", "patch"].includes(method.toLowerCase())) {
      return{
        success: false,
        message: "Invalid HTTP method",
      }
    }

    startTime = Date.now();

    console.log(url, method);

    const response = await axios({
      method: method.toLowerCase(),
      url: url,
    });

    endTime = Date.now();

    logData = {
      statusCode: response.status,
      statusText: response.statusText,
      responseTime: endTime - startTime,
      timestamp: new Date(),
      status: response.status >= 200 && response.status < 300 ? "Up" : "Down",
    };

    console.log(logData, url);

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

    return{
      success: true,
      message: "Log added successfully",
    };
  } catch (error) {

    let { url, method } = req.body;

    endTime = Date.now();

    logData = {
      statusCode: error.response ? error.response.status : 500,
      statusText: error.response ? error.response.statusText : "Internal Server Error",
      status: error.response && error.response.status >= 200 && error.response.status < 300 ? "Up" : "Down",
      responseTime: endTime - startTime,
      timestamp: new Date(),
    };

    console.log(logData+'------------------');

    console.error("Error during API call:", error.message);

    try {
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
    } catch (logError) {
      console.error("Error saving log:", logError.message);
      return {
        success: false,
        message: "Error saving log",
        error: logError.message,
      };
    }
  }
};

const deleteLogs = async (req, res) => {
  const logId = req.query.logId;
  const user_id = req.user._id;
  if (!user_id) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }
  try {
    const logs = await ApiLog.findOneAndDelete({ _id: logId, userId: user_id });
    if (logs) {
      return {
        success: true,
        message: "Logs deleted successfully",
        data: logs,
      };
    } else {
      return {
        success: false,
        message: "Error deleting logs",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error deleting logs",
      error: error.message,
    };
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
  deleteLogs,
};
