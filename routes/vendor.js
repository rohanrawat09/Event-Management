const { Router } = require("express");

//jwt
const JWT = require("jsonwebtoken");
const secret = "123";
//

const multer = require("multer");
const path = require("path");

//vendor model
const Vendor = require("../models/vendor");
const Product = require("../models/product");

//end
const router = Router();

//setting multer configure
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/product"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

//multer middleware

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Error: Only images are allowed!");
    }
  },
});
//end

router.get("/signup", (req, res) => {
  return res.render("vendorsignup");
});

router.post("/signup", async (req, res) => {
  const { name, email, password, category } = req.body;

  //console.log(name + " " + category);

  try {
    const vendor = await Vendor.findOne({ email: email });
    if (vendor) {
      return res.render("vendorsignup", {
        message: "Email Id already exists",
      });
    }

    const vendor1 = await Vendor.create({
      name,
      password,
      email,
      category,
    });

    //creating token
    const payload = {
      _id: vendor1._id,
      name: vendor1.name,
      email: vendor1.email,
      category: vendor1.category,
    };

    const token = JWT.sign(payload, secret);

    return res.cookie("token", token).render("vendor", {
      name: name,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).render("signup", {
      message: "Server error",
    });
  }
});

router.get("/login", (req, res) => {
  return res.render("vendorlogin");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const vendor = await Vendor.findOne({ email: email, password: password });
  if (!vendor) {
    return res.render("vendorlogin", {
      message: "Invalid eamil or password",
    });
  }

  //creating cookies
  const payload = {
    _id: vendor._id,
    name: vendor.name,
    email: vendor.email,
    category: vendor.category,
  };

  const token = JWT.sign(payload, secret);

  return res.cookie("token", token).render("vendor", {
    name: vendor.name,
  });
});

router.get("/transection", async (req, res) => {
  return res.send("transaction page");
});

router.get("/additem", async (req, res) => {
  return res.render("additem");
});

router.post("/additem", upload.single("productimage"), async (req, res) => {
  const { productname, productprice } = req.body;

  const productImage = req.file;

  //console.log(productname, productprice);

  const token = req.cookies.token;

  const decoded = JWT.verify(token, secret);

  //console.log(decoded);

  await Product.create({
    productname,
    productprice,
    productimage: productImage.filename,
    createdBy: decoded._id,
  });

  return res.render("additem", {
    message: "Product added successfully",
  });
});

router.get("/item", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .render("vendoritem", { message: "Unauthorized. No token provided." });
  }

  try {
    const decoded = JWT.verify(token, secret);

    const pro = await Product.find({ createdBy: decoded._id });

    // console.error(pro);

    return res.render("vendoritem", { pro });
  } catch (err) {
    console.error("Error verifying token or fetching products:", err);
    return res
      .status(500)
      .render("vendoritem", { message: "Error retrieving products." });
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("token");
  return res.redirect("/");
});

module.exports = router;
