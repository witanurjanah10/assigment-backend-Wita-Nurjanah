require("dotenv").config();
const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const bcrypt = require("bcrypt");

(async () => {
  try {
    await connectDB(
      process.env.MONGO_URI || "mongodb://localhost:27017/jwt_admin_users"
    );
    const username = process.env.SEED_ADMIN_USERNAME || "admin";
    const password = process.env.SEED_ADMIN_PASSWORD || "admin123";

    const exists = await Admin.findOne({ username });
    if (exists) {
      console.log("Admin sudah ada:", username);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ username, passwordHash });
    console.log("Admin dibuat:", username, "password:", password);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
