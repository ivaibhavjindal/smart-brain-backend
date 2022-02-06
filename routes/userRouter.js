const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user");
const authenticate = require("../authenticate");

const extractUser = ({
  firstName = "",
  lastName = "",
  imageModels,
  textModels,
  images,
}) => ({
  firstName,
  lastName,
  imageModels,
  textModels,
  images,
});

router.post("/signin", passport.authenticate("local"), (req, res) => {
  const token = authenticate.getToken({ _id: req.user._id });
  res.json({
    isLoggedIn: true,
    token: token,
    user: extractUser(req.user),
    error: "",
  });
});

router.post("/signup", (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) {
        res.json({ isLoggedIn: false, error: err });
      } else {
        if (req.body.firstName) user.firstName = req.body.firstName;
        if (req.body.lastName) user.lastName = req.body.lastName;
        user.save((err, user) => {
          if (err) {
            res.json({ isLoggedIn: false, error: err });
          }
          passport.authenticate("local")(req, res, () => {
            const token = authenticate.getToken({ _id: req.user._id });

            res.json({
              isLoggedIn: true,
              token: token,
              user: extractUser(user),
              error: "",
            });
          });
        });
      }
    }
  );
});

router.get("/isLoggedIn", (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) res.json({ isLoggedIn: false, error: info });
    res.json({ isLoggedIn: true, error: "", user: extractUser(user) });
  })(req, res);
});

module.exports = router;
