const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  empid: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpires: {
    type: Date,
  },
});

module.exports = mongoose.model("employeeid", userSchema);
