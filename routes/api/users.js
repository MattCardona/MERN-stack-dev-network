const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const {User} = require('../../models/Users.js');

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
        const newUser = new User({name, email, avatar, password})
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


module.exports = router;