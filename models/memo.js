const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wagonSchema = new Schema({
  wagonNumber: { type: String },
  wagonType: { type: String },
  tare: { type: Number },
  wagondate: { type: String },
  releaseDate: { type: String },
  releaseTime: { type: String },
  remarks: { type: String },
  challan_number: { type: String },
  selected: { type: Boolean, default: false },
});

const memoSchema = new Schema({
  memoNumber: { type: String, required: true },
  date: { type: Date, required: true },
  loadingPoint: {
    code: { type: String, required: true },
    description: { type: String, required: true },
  },
  unloadingPoint: {
    code: { type: String, required: true },
    description: { type: String, required: true },
  },
  wagons: [wagonSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  acknowledged: { type: Boolean, default: false },
  isUnloaded: { type: Boolean, default: false },
});

// Add index for frequently queried fields

// Middleware to update the updatedAt field before saving
memoSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});
wagonSchema.pre("save", function (next) {
  if (this.isNew) {
    // Generate a random 10-digit challan number starting with 1000
    const randomPart = Math.floor(10000000 + Math.random() * 90000000); // 8 digits
    this.challan_number = `1000${randomPart}`;
  }
  next();
});
module.exports = mongoose.model("Memo", memoSchema);
