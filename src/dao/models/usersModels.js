const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  age: { type: Number },
  password: { type: String, required: true }, // se guarda en hash
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", default: null },
  role: { type: String, enum: ["user", "admin"], default: "user" }
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);
module.exports = { userModel };
