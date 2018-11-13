const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const { secret } = require('../../config/keys.js');
const { User } = require('../../models/Users.js');

// @route GET api/users/test
// @desc Test Users route
// @access  Public
router.get('/test', (req, res) => res.json({msg: "Users works"}));

// @route GET api/users/register
// @desc register Users route
// @access  Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if(user){
        return res.status(400).json({email: "Email already exists"});
      } else {
        const { name, email, password } = req.body;
        const avatar = gravatar.url(email, {
          s: "200", //size
          r: "pg", //rating
          d: "retro" //default
        });
        const newUser = new User({name, email, avatar, password});

        //SALT & HASH users password before saving the user to the database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(`There was a error ${JSON.stringify(err, undefined, 2)}`));
          });
        });
      }
    });
});

// @route GET api/users/login
// @desc login User and return JWT token back
// @access  Public
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  //first find user by email
  User.findOne({email})
    .then(user => {
      //check for a user
      if(!user){
        return res.status(404).json({ email: "User not found"});
      }
      //check the users password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch){
            // res.json({msg: "Success"});
            //User matched
            const {id, name, avatar} = user;
            const payload = { id, name, avatar};
            //sign the token aka create the token and send it to the user
            jwt.sign(payload, secret, { expiresIn: 3600}, (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
            });

          }else{
            return res.status(400).json({password: "Password was incorrect"});
          }
        })

    });
});

// @route GET api/users/current
// @desc return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});

module.exports = router;