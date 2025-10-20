const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const hashPassword = plain => bcrypt.hashSync(plain, SALT_ROUNDS);
const comparePasswords = (plain, hashed) => bcrypt.compareSync(plain, hashed);

module.exports = { hashPassword, comparePasswords };
