const jwt = require("jsonwebtoken");

module.exports = function isDoctor(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Нет токена" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "doctor") {
      return res.status(403).json({ message: "Доступ только для врача" });
    }

    req.user = decoded; // 👈 ВАЖНО
    next();
  } catch (err) {
    return res.status(401).json({ message: "Невалидный токен" });
  }
};
