const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//routes variable
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const vendorRoute = require("./routes/vendor");

//end

mongoose
  .connect(
    "mongodb://127.0.0.1:27017/event_management?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.10"
  )
  .then((error) => {
    console.log("MongoDB connected");
  });

app.get("/", async (req, res) => {
  res.render("home");
});

//setting routes
app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/vendor", vendorRoute);

app.listen(8003, () => {
  console.log("Server Stated at port : ", 8003);
});
