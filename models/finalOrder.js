const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const order = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  orderedBy: {
    type: String,
    required: true,
  },
});

const FinalOrder = mongoose.model("FinalOrder", order, "finalorders");

module.exports = FinalOrder;
