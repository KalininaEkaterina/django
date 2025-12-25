require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
require("./config/passport");

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(
  session({
    secret: "SUPER_SECRET",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", require("./routes/auth"));
app.use("/services", require("./routes/serviceRoutes"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/appointments", require("./routes/appointment"));
app.use("/api/doctor/visits", require("./routes/doctorVisits"));


app.listen(5000, () => console.log("Server running on http://localhost:5000"));
