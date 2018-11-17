const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const validatePostInput = require('../../validation/post.js');
const { Post } = require('../../models/Post.js');
const { Profile } = require('../../models/Profile.js');

// @route GET api/posts/test
// @desc Test Posts route
// @access  Public
router.get('/test', (req, res) => res.json({msg: "Posts works"}));

// @route GET api/posts/
// @desc Get Posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({date: -1})
    .then(posts => res.json(posts))
    .catch(err => {
      console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`)
      res.status(404).json({nopostsfound: "No posts found"});
    });
});

// @route GET api/posts/:id
// @desc Get single Post
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => {
      console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`)
      res.status(404).json({nopostfound: "No post found with that ID"});
    });
})

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

// @route DELETE api/posts/:id
// @desc Delete Post
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //check for post owner
          if(post.user.toString() !== req.user.id){
            return res.status(401).json({notauthorized: "User not authorized"});
          }
          //delete the post
          post.remove().then(() => res.json({success: true}))
            .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
        })
    })
    .catch(err => {
      console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`)
      res.status(404).json({postnotfound: "No post found"});
    });
});


// @route POST api/posts/like/:id
// @desc Like Post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({alreadyliked: "User already likes this post"});
          }
          post.likes.unshift({user: req.user.id});
          post.save().then(post => res.json(post))
            .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
        })
    })
    .catch(err => {
      console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`)
      res.status(404).json({postnotfound: "No post found"});
    });
});

// @route POST api/posts/unlike/:id
// @desc Unlike Post
// @access  Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({user: req.user.id})
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({notliked: "You have not liked this post"});
          }
          const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);
          post.likes.splice(removeIndex, 1);
          post.save().then(post => res.json(post))
            .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
        })
    })
    .catch(err => {
      console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`)
      res.status(404).json({postnotfound: "No post found"});
    });
});

// @route POST api/posts/comment/:id
// @desc Add comment to post
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const {errors, isValid} = validatePostInput(req.body);

  if(!isValid){
    return res.status(400).json(errors)
  }

  const {text, name, avatar} = req.body;
  Post.findById(req.params.id)
    .then(post => {
      const newComment = {text, name, avatar, user: req.user.id};
      post.comments.unshift(newComment);
      post.save().then(post => res.json(post))
        .catch(err => res.status(400).json({postnotfound: "No post found"}))
    })
});

// @route DELETE api/posts/comment/:id/:comment_id
// @desc delete comment from post
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res)=> {
  Post.findById(req.params.id)
    .then(post => {
      if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0){
        return res.status(404).json({commentnotexists: "Comment does not exist"});
      }
      const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);
      post.comments.splice(removeIndex, 1);
      post.save().then(() => res.json(post));
    })
    .catch(err => res.status(400).json({postnotfound: "No post found"}))
});


module.exports = router;