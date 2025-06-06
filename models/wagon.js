const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  wagonNumber: { type: String, required: true },
  wagonType: { type: String, required: true },
});

module.exports = mongoose.model("wagon", userSchema);
