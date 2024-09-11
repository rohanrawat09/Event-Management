const { Router } = require("express");

//User model
const User = require("../models/user");
const Vendor = require("../models/vendor");
const Order = require("../models/order");
const FinalOrder = require("../models/finalOrder");
//jwt
const JWT = require("jsonwebtoken");
const Product = require("../models/product");
const secret = "123";
//

const router = Router();

router.get("/signup", (req, res) => {
  return res.render("usersignup");
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  //console.log(name + " " + email + " " + password);

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.render("usersignup", {
        message: "Email Id already exists",
      });
    }

    const user1 = await User.create({
      name,
      password,
      email,
    });

    const payload = {
      _id: user1._id,
      name: user1.name,
      email: user1.email,
    };

    const token = JWT.sign(payload, secret);

    return res.cookie("token", token).render("user" + name);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).render("signup", {
      message: "Server error",
    });
  }
});

router.get("/login", async (req, res) => {
  return res.render("userlogin");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email, password: password });
  if (!user) {
    return res.render("userlogin", {
      message: "Invalid eamil or password",
    });
  }

  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  const token = JWT.sign(payload, secret);

  return res.cookie("token", token).render("user", {
    name: user.name,
  });
});

router.get("/album", async (req, res) => {
  const vendor = await Vendor.find({});

  //console.log(vendor);
  res.render("album", {
    vendor,
  });
});

router.get("/vendor/:id", async (req, res) => {
  const id = req.params.id;
  const pro = await Product.find({ createdBy: id });

  return res.render("products", { pro });
});

router.post("/product/:id", async (req, res) => {
  const id = req.params.id;

  const product = await Product.findById(id);

  const token = req.cookies.token;

  const decoded = JWT.verify(token, secret);

  let order = await Order.findOne({
    productname: product.productname,
    orderedBy: decoded._id,
  });

  if (order) {
    order.quantity = (order.quantity || 0) + 1;
    await order.save();
  } else {
    await Order.create({
      productname: product.productname,
      productimage: product.productimage,
      productprice: product.productprice,
      orderedBy: decoded._id,
      quantity: 1,
    });
  }

  const cart = await Order.find({ orderedBy: decoded._id });

  let total = 0;

  cart.forEach((c) => {
    total = total + c.quantity * c.productprice;
  });

  res.render("cart", { cart, total });
});

router.get("/cart", async (req, res) => {
  const token = req.cookies.token;

  const decoded = JWT.verify(token, secret);

  const cart = await Order.find({ orderedBy: decoded._id });

  let total = 0;

  cart.forEach((c) => {
    total = total + c.quantity * c.productprice;
  });

  res.render("cart", { cart, total });
});

router.post("/remove/:id", async (req, res) => {
  const id = req.params.id;

  await Order.findByIdAndDelete(id);

  const token = req.cookies.token;

  const decoded = JWT.verify(token, secret);

  const cart = await Order.find({ orderedBy: decoded._id });

  res.render("cart", { cart });
});

router.get("/order", async (req, res) => {
  res.render("order");
});

router.post("/order", async (req, res) => {
  const { name, email, city, number, state, pincode, method, address } =
    req.body;

  const token = req.cookies.token;

  const decoded = JWT.verify(token, secret);
  //console.log(name, email, city, number, state, pincode, method, address);
  await FinalOrder.create({
    name,
    email,
    city,
    number,
    state,
    pincode,
    method,
    address,
    orderedBy: decoded._id,
  });

  res.render("order", { message: "Ordered Successful" });
});

router.get("/status", async (req, res) => {
  const token = req.cookies.token;

  const decoded = JWT.verify(token, secret);

  let pro = await FinalOrder.find({ orderedBy: decoded._id });

  res.render("status", { pro });
});

router.get("/logout", async (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
});

module.exports = router;
