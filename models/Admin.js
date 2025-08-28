const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    // you can add more fields (email, name) if needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
