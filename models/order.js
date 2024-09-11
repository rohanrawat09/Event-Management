const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  productname: {
    type: String,
    required: true,
  },
  productprice: {
    type: Number,
    required: true,
  },
  productimage: {
    type: String,
  },
  orderedBy: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
  },
});

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;
