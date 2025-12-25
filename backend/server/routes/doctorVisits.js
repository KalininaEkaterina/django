const router = require("express").Router();
const PlannedVisit = require("../models/PlannedVisit");
const AppointmentSchedule = require("../models/AppointmentSchedule");
const isDoctor = require("../middleware/isDoctor");

router.get("/", isDoctor, async (req, res) => {
  try {
    const visits = await PlannedVisit.find()
      .populate({
        path: 'schedule',
        match: { doctor: req.user.doctorProfileId }
      })
      .populate('client')
      .populate('services');

    const doctorVisits = visits.filter(v => v.schedule !== null);
    res.json(doctorVisits);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", isDoctor, async (req, res) => {
  try {
    const { diagnosis_text, date, time_start, time_end } = req.body;
    const visit = await PlannedVisit.findById(req.params.id);

    visit.diagnosis_text = diagnosis_text;
    await visit.save();

    await AppointmentSchedule.findByIdAndUpdate(visit.schedule, {
      date, time_start, time_end
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", isDoctor, async (req, res) => {
  await PlannedVisit.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;