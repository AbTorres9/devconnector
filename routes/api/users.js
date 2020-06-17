const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

const User = require("../../models/User");

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
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ message: "email already exists" });
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

module.exports = router;
