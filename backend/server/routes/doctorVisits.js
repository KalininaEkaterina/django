const router = require("express").Router();
const Visit = require("../models/Visit");
const auth = require("../middleware/auth");
const isDoctor = require("../middleware/isDoctor");

/* ================= СПИСОК ЗАПИСЕЙ ================= */
router.get("/", auth, isDoctor, async (req, res) => {
  const visits = await Visit.find({
    "schedule.doctor": req.user.id,
  })
    .populate("services")
    .sort({ "schedule.date": -1 });

  res.json(visits);
});

/* ================= ОДНА ЗАПИСЬ ================= */
router.get("/:id", auth, isDoctor, async (req, res) => {
  const visit = await Visit.findById(req.params.id).populate("services");
  res.json(visit);
});

/* ================= ОБНОВЛЕНИЕ ================= */
router.put("/:id", auth, isDoctor, async (req, res) => {
  const visit = await Visit.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(visit);
});

/* ================= УДАЛЕНИЕ ================= */
router.delete("/:id", auth, isDoctor, async (req, res) => {
  await Visit.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
