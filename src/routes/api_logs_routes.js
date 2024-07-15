const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
  addLogs,
  deleteLogs,
  getLogs,
  getAllLogs,
} = require("../controllers/api_logs_controller.js");

router.post("/addLog", user_auth, addLogs);

router.delete("/deleteLog", user_auth, deleteLogs);

router.get("/getLogs", user_auth, getLogs);

router.get("/getAllLogs", user_auth, getAllLogs);

module.exports = router;
