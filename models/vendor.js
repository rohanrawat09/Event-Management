const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const vendorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const Vendor = mongoose.model("Vendor", vendorSchema, "vendors");

module.exports = Vendor;
