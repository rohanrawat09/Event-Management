const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const productSchema = new Schema({
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
  createdBy: {
    type: String,
    //required: true,
    ref: "Vendor",
  },
});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
