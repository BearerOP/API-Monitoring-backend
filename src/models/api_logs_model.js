const mongoose = require("mongoose");

const apiLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  url: { type: String, required: true },
  method: { type: String, required: true },
  logs: [{
    status: { type: Number, required: true },
    statusText: { type: String, required: true },
    responseTime: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
});

const ApiLog = mongoose.model("ApiLog", apiLogSchema);

module.exports = ApiLog;
