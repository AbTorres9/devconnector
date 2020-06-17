const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const validateRegisterInput = require("../../validation/register");

const User = require("../../models/User");
const keys = require("../../config/keys");

// @route   GET api/users/test
// @desc    TEST USER ROUTES
// @access  PUBLIC
router.get("/test", (req, res) => {
  res.json({ msg: "Users Works" });
});

// @route   POST api/users/register
// @desc    REGISTER USER
// @access  PUBLIC
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //CHECK VALIDATION
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = "Emil already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //SIZE
        r: "pg", //RATING
        d: "mm", //DEFAULT
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          // Store hash in your password DB.
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route   POST api/users/login
// @desc    LOGIN USER/ RETURNING JWT TOKEN
// @access  PUBLIC
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //FIND USER BY EMAIL
  User.findOne({ email }).then((user) => {
    //CHECK FOR USER
    if (user) {
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          //USER MATCHED
          const payload = { id: user.id, name: user.name, avatar: user.avatar }; //CREATE JWT PAYLOAD

          //SIGN TOKEN
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, TOKEN) => {
              res.json({
                success: true,
                TOKEN: "Bearer " + TOKEN,
              });
            }
          );
        } else {
          return res.status(400).json({ password: "Password incorrect" });
        }
      });
    } else {
      return res.status(404).json({ email: "user not found" });
    }
  });
});

// @route   GET api/users/current
// @desc    RETURN CURRENT USER
// @access  PRIVATE
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
