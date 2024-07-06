const mongoose = require("mongoose");

const apiLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  url: { type: String, required: true },
  method: { type: String, required: true },
  status: { type: Number, required: true },
  responseTime: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ApiLog = mongoose.model("ApiLog", apiLogSchema);
