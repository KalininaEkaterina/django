const express = require("express");
const Appointment = require("../models/Appointment");
const Cart = require("../models/Cart");
const auth = require("../middleware/auth");
const router = express.Router();

// CREATE appointment
router.post("/", auth, async (req, res) => {
  const { doctor, date, timeStart } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart || cart.services.length === 0)
    return res.status(400).json({ message: "Cart is empty" });

  const appointment = await Appointment.create({
    user: req.user.id,
    doctor,
    services: cart.services,
    date,
    timeStart
  });

  cart.services = [];
  await cart.save();

  res.json(appointment);
});

// MY appointments
router.get("/my", auth, async (req, res) => {
  const appointments = await Appointment.find({ user: req.user.id })
    .populate("services")
    .populate("doctor");
  res.json(appointments);
});

module.exports = router;
