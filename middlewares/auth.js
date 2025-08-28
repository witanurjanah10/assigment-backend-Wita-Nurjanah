// middleware/auth.js
// middlewares/auth.js
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const jwtSecret = process.env.JWT_SECRET || "secret";

async function authenticateAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, jwtSecret);

    const admin = await Admin.findById(payload.adminId).select("-passwordHash");
    if (!admin) {
      return res.status(401).json({ message: "Admin tidak ditemukan" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res
      .status(401)
      .json({ message: "Token tidak valid atau kadaluarsa" });
  }
}

module.exports = { authenticateAdmin };
