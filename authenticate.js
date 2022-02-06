const jwt = require("jsonwebtoken");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const config = require("./config");
const passport = require("passport");
const User = require("./models/user");

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) =>
  jwt.sign(user, config.secret, { expiresIn: "24h" });

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret,
};

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwtPayload, done) => {
    console.log(jwtPayload);
    User.findOne({ _id: jwtPayload._id }, (err, user) => {
      if (err) return done(err, false);
      else if (user) return done(null, user);
      else return done(null, false);
    });
  })
);

exports.verifyUser = passport.authenticate("jwt", { session: false });
