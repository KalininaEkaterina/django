const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

/* ================= ROLE ================= */
function getRoleByEmail(email = "") {
  return email.endsWith("@doctor.com") ? "doctor" : "user";
}

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= REGISTER ================= */
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const role = getRoleByEmail(email);
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hash,
      role,
    });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, role });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GOOGLE ================= */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const email = req.user.profile.emails[0].value;
      const role = getRoleByEmail(email);

      let user = await User.findOne({ email });

      // 🔥 СОЗДАЁТСЯ ТОЛЬКО ОДИН РАЗ
      if (!user) {
        user = await User.create({
          email,
          role,
          provider: "google",
          providerId: req.user.profile.id,
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // 🔥 РЕДИРЕКТ СРАЗУ ПО РОЛИ
      if (role === "doctor") {
        res.redirect(`http://localhost:3000/doctor/services?token=${token}`);
      } else {
        res.redirect(`http://localhost:3000/services?token=${token}`);
      }
    } catch (err) {
      console.error(err);
      res.redirect("http://localhost:3000/auth");
    }
  }
);


/* ================= FACEBOOK (FAKE) ================= */
router.get("/facebook", async (req, res) => {
  const email = "demo@facebook.com";
  const role = getRoleByEmail(email);

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      role,
      provider: "facebook",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.redirect(`http://localhost:3000/auth?token=${token}`);
});

module.exports = router;
