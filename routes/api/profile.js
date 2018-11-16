const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validateProfileInput = require('../../validation/profile.js');
const validateExperienceInput = require('../../validation/experience.js');
const validateEducationInput = require('../../validation/education.js');
const { Profile } = require('../../models/Profile.js');
const { User } = require('../../models/Users.js');


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

// @route GET api/profile/all
// @desc get all profiles
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};

  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if(!profiles){
        errors.noprofiles = "Their are no profiles";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(e => res.status(404).json({profile: "Their are no profiles"}));
});



// @route GET api/profile/handle/:handle
// @desc get user profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  const {handle} = req.params;
  const errors = {};

  Profile.findOne({handle})
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

// @route GET api/profile/user/:user_id
// @desc get user profile by user id
// @access  Public
router.get('/user/:user_id', (req, res) => {
  const {user_id} = req.params;
  const errors = {};

  Profile.findOne({user: user_id})
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if(!profile){
        errors.noprofile = "Their is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(e => res.status(404).json({profile: "Their is no profile for this user"}));
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


// @route POST api/profile/experience
// @desc add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
  const {errors, isValid} = validateExperienceInput(req.body);

  if(!isValid){
    return res.status(400).json(errors);
  }

  Profile.findOne({user: req.user.id})
    .then(profile => {
        console.log("at least in here");
      const {title, company, location, to, current, description} = req.body;
      const newExperience = {
        title,
        company,
        location,
        to,
        from: req.body.from,
        current,
        description
      };
      //add to the experience array
      profile.experience.unshift(newExperience);
      profile.save()
        .then(profile => res.json(profile))
        .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
    })
    .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
});

// @route POST api/profile/education
// @desc add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', {session: false}), (req, res) => {
  const {errors, isValid} = validateEducationInput(req.body);

  if(!isValid){
    return res.status(400).json(errors);
  }

  Profile.findOne({user: req.user.id})
    .then(profile => {
      const {school, degree, fieldofstudy, to, current, description} = req.body;
      const newEducation = {
        school,
        degree,
        fieldofstudy,
        to,
        from: req.body.from,
        current,
        description
      };
      //add to the experience array
      profile.education.unshift(newEducation);
      profile.save()
        .then(profile => res.json(profile))
        .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
    })
    .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
});

// @route DELETE api/profile/experience/:exp_id
// @desc delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      //Create new experience array
      const newExperienceArr = profile.experience.filter(exp => {
        return exp.id !== req.params.exp_id;
      });
      if(newExperienceArr.length !== profile.experience.length){
        profile.experience = newExperienceArr;
        profile.save()
          .then(profile => res.json(profile))
          .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
      }
    })
    .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
});


// @route DELETE api/profile/education/:edu_id
// @desc delete education from profile
// @access  Private
router.delete('/education/:edu_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      //Create new education array
      const newEducationArr = profile.education.filter(edu => {
        return edu.id !== req.params.edu_id;
      });
      if(newEducationArr.length !== profile.education.length){
        profile.education = newEducationArr;
        profile.save()
          .then(profile => res.json(profile))
          .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
      }else{
        res.status(404).json({"msg": "Something went wrong"});
      }
    })
    .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
});


// @route DELETE api/profile/
// @desc delete profile and user
// @access  Private

router.delete('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  Profile.findOneAndRemove({user: req.user.id})
    .then(() => {
      User.findByIdAndDelete(req.user.id)
        .then(() => res.json({success: true}))
            .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));

    })
    .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
});

module.exports = router;