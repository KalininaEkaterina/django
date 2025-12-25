const router = require("express").Router();
const Service = require("../models/Service");
const DoctorCategory = require("../models/DoctorCategory");
const isDoctor = require("../middleware/isDoctor");


router.get("/", async (req, res) => {
  const { category, min_price, max_price, search } = req.query;

  let filter = {};

  if (category) filter.category = category;
  if (min_price) filter.price = { ...filter.price, $gte: min_price };
  if (max_price) filter.price = { ...filter.price, $lte: max_price };
  if (search) filter.name = { $regex: search, $options: "i" };

  const services = await Service.find(filter).populate("category");
  res.json(services);
});

router.get("/categories", async (req, res) => {
  res.json(await DoctorCategory.find());
});

router.get("/doctor", isDoctor, async (req, res) => {
  const { search, sort } = req.query;

  let query = {};
  if (search) query.name = { $regex: search, $options: "i" };

  const services = await Service
    .find(query)
    .sort(sort || "name")
    .populate("category");

  res.json(services);
});

router.post("/doctor", isDoctor, async (req, res) => {
  const service = await Service.create(req.body);
  res.json(service);
});

router.put("/doctor/:id", isDoctor, async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(service);
});

router.delete("/doctor/:id", isDoctor, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
