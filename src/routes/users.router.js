const express = require("express");
const { userModel } = require("../dao/models/usersModels");
const { hashPassword } = require("../utils/hash");

const router = express.Router();

// Crear usuario
router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await userModel.findOne({ email });
    if (exists) return res.status(409).json({ error: "El email ya está registrado" });

    const newUser = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashPassword(password)
    });

    res.status(201).json({ message: "Usuario creado", id: newUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los usuarios
router.get("/", async (_, res) => {
  const users = await userModel.find().select("-password");
  res.json(users);
});

// Obtener usuario por ID
router.get("/:id", async (req, res) => {
  const user = await userModel.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(user);
});

// Actualizar usuario
router.put("/:id", async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) updates.password = hashPassword(updates.password);
    const user = await userModel.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar usuario
router.delete("/:id", async (req, res) => {
  await userModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Usuario eliminado" });
});

module.exports = router;
