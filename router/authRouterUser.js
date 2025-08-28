const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { authenticateAdmin } = require("../middlewares/auth");

router.use(authenticateAdmin);

router.post("/", async (req, res) => {
  try {
    const { name, nik, email, password } = req.body;

    // Validasi input dasar
    if (!name || !nik || !email || !password) {
      return res.status(400).json({
        message: "Semua field (name, nik, email, password) wajib diisi.",
      });
    }

    // PERBAIKAN #4: Cek duplikasi email atau NIK sebelum membuat
    const existingUser = await User.findOne({ $or: [{ email }, { nik }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email atau NIK sudah terdaftar." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      nik,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User berhasil dibuat", user });
  } catch (err) {
    // PERBAIKAN #5: Perbaiki logging error agar lebih detail
    console.error("Error creating user:", err.message);
    res.status(500).json({ message: "Gagal membuat user" });
  }
});

// READ all users (admin only)
router.get("/", async (req, res) => {
  try {
    // Sembunyikan field password saat mengambil semua data user
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Gagal mengambil data user" });
  }
});

// READ single user (admin only)
router.get("/:id", async (req, res) => {
  try {
    // Sembunyikan field password
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    res.status(500).json({ message: "Gagal mengambil data user" });
  }
});

// UPDATE user (admin only)
// PERBAIKAN #6: Update tidak boleh mengubah password secara langsung
router.put("/:id", async (req, res) => {
  try {
    const { name, nik, email } = req.body; // Password tidak di-update di sini

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, nik, email }, // Hanya update data ini
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json({ message: "User berhasil diupdate", user });
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ message: "Gagal update user" });
  }
});

// DELETE user (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });
    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ message: "Gagal hapus user" });
  }
});

module.exports = router;
