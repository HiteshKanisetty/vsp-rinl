const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  wagonNumber: { type: String, required: true },
  wagonType: { type: String, required: true },
  isLocked: { type: Boolean, default: false },
  lockedByMemo: { type: String, default: null },
});

module.exports = mongoose.model("wagon", userSchema);
