const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//LOAD PROFILE MODEL
const Profile = require("../../models/Profile");
//LOAD USER MODEL
const User = require("../../models/User");

router.get("/test", (req, res) => {
  res.json({ msg: "Profile Works" });
});

// @route   GET api/profile
// @desc    GET CURRENT USER PROFILE
// @access  PRIVATE
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json({ errors });
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

module.exports = router;
