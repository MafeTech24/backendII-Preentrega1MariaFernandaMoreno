const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { userModel } = require("../dao/models/usersModels");
const { comparePasswords } = require("../utils/hash");
const { config } = require("./config");

const JWT_SECRET = config.JWT_SECRET || "claveultrasecreta";


passport.use("local", new LocalStrategy(
  { usernameField: "email", passwordField: "password", session: false },
  async (email, password, done) => {
    try {
      const user = await userModel.findOne({ email });
      if (!user) return done(null, false, { message: "Usuario no encontrado" });
      const valid = comparePasswords(password, user.password);
      if (!valid) return done(null, false, { message: "Contraseña incorrecta" });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));


const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

passport.use("jwt", new JwtStrategy(opts, async (payload, done) => {
  try {
    const user = await userModel.findById(payload.sub).select("-password");
    if (!user) return done(null, false, { message: "Token inválido o usuario no existe" });
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;
