const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validatePostInput = require('../../validation/post.js');
const { Post } = require('../../models/Post.js');

// @route GET api/posts/test
// @desc Test Posts route
// @access  Public
router.get('/test', (req, res) => res.json({msg: "Posts works"}));

// @route POST api/posts/
// @desc Create Post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const {errors, isValid} = validatePostInput(req.body);

  if(!isValid){
    return res.status(400).json(errors)
  }

  const {text, name, avatar} = req.body;
  new Post({text, name, avatar, user: req.user.id}).save()
    .then(post => res.json(post))
    .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
});

module.exports = router;