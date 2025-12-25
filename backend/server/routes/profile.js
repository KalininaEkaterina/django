const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const DoctorProfile = require("../models/DoctorProfile");
const ClientProfile = require("../models/ClientProfile");
const axios = require("axios");

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.role === "doctor") {
    const profile = await DoctorProfile.findOne({ user: user._id });
    return res.json({ role: "doctor", user, profile });
  }

  if (user.role === "client") {
    const profile = await ClientProfile.findOne({ user: user._id });

    let joke = "";
    try {
      const r = await axios.get("https://v2.jokeapi.dev/joke/Medical?type=single");
      joke = r.data.joke;
    } catch {
      joke = "Шутка не найдена";
    }

    return res.json({ role: "client", user, profile, joke });
  }
});

module.exports = router;
