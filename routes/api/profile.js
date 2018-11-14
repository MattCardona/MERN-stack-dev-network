const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const { Profile } = require('../../models/Profile.js');
const { Users } = require('../../models/Users.js');


// @route GET api/profile/test
// @desc Test Profile route
// @access  Public
router.get('/test', (req, res) => res.json({msg: "Profile works"}));

// @route GET api/profile/
// @desc Get current users profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({user: req.user.id})
    .then(profile => {
      if(!profile){
        errors.noprofile = "Their is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(e => res.status(404).json(e));
});

module.exports = router;