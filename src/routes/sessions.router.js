const express = require("express");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const { config } = require("../config/config");

const router = express.Router();
const JWT_SECRET = config.JWT_SECRET || "claveultrasecreta";

// Login: genera el token JWT
router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || "Credenciales inválidas" });

    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login exitoso", token });
  })(req, res, next);
});

// /current - valida el token y devuelve los datos del usuario autenticado
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
