const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validateProfileInput = require('../../validation/profile.js');
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
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if(!profile){
        errors.noprofile = "Their is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(e => res.status(404).json(e));
});

// @route POST api/profile/
// @desc Create or edit user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const {errors, isValid} = validateProfileInput(req.body);

  if(!isValid){
    return res.status(400).json(errors);
  }

  const { handle, company, website, location, bio, status, githubusername, skills, youtube, twitter, linkedin, facebook, instagram } = req.body;
  const profileFeilds = {};
  profileFeilds.user = req.user.id;
  profileFeilds.social = {};
  if(handle) profileFeilds.handle = handle;
  if(company) profileFeilds.company = company;
  if(website) profileFeilds.website = website;
  if(location) profileFeilds.location = location;
  if(bio) profileFeilds.bio = bio;
  if(status) profileFeilds.status = status;
  if(githubusername) profileFeilds.githubusername = githubusername;
  // skills string need to make to array
  if(typeof skills !== undefined){
    profileFeilds.skills = skills.split(",");
  }
  // social
  if(youtube) profileFeilds.social.youtube = youtube;
  if(twitter) profileFeilds.social.twitter = twitter;
  if(linkedin) profileFeilds.social.linkedin = linkedin;
  if(facebook) profileFeilds.social.facebook = facebook;
  if(instagram) profileFeilds.social.instagram = instagram;

  Profile.findOne({user: req.user.id})
    .then(profile => {
      if(profile){
        //update profile
        Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFeilds}, {new: true})
          .then(profile => res.json(profile))
          .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
      }else{
        //create profile
        //first check if handle exists
        Profile.findOne({handle: profileFeilds.handle})
          .then(profile => {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          })
          .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
        //Create a new profile
        new Profile(profileFeilds).save()
          .then(profile => {
            res.json(profile);
          })
          .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
      }
    })
    .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
});

module.exports = router;