const express = require("express");
const router = express.Router();

const user_auth = require("../../middleware/user_auth.js");

const {
    addLogs,
    getLogs,
} = require("../controllers/api_logs_controller.js");

router.post("/add", user_auth, addLogs);

router.get("/getAll", user_auth, getLogs);

module.exports = router;