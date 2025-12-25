const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: String,
    email: { type: String, required: true, unique: true },
    password: String, // null для OAuth
    role: { type: String, enum: ["client", "doctor"], default: "client" },
    provider: { type: String, default: "local" }, // local | google | facebook
    providerId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
