const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password wajib diisi." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Kredensial tidak valid." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Kredensial tidak valid." });
    }

    const payload = {
      id: user.id,
      name: user.name,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          message: "Login berhasil!",
          token: token,
        });
      }
    ); // <-- Pastikan tanda kurung tutup ini ada
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});
module.exports = router;
