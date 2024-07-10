const {
    addLogs,
    getLogs,
    getAllLogs
} = require("../services/api_logs_service.js");


exports.addLogs = async (req, res) => {
    try {
      const data = await addLogs(req, res);
      console.log(data);
      // res.send("hi")
      if (data.success) {
        res.send(data);
      } else {
        res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

exports.getLogs = async (req, res) => {
    try {
      const data = await getLogs(req, res);
      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
exports.getAllLogs = async (req, res) => {
    try {
      const data = await getAllLogs(req, res);
      if (data.success) {
        res.status(200).json(data);
      } else {
        res.status(403).json(data);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  

