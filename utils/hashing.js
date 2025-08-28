const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

// ketika buat user
const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

// ketika login
const match = await bcrypt.compare(password, user.passwordHash);
