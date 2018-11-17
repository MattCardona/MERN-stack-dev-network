const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const {mongoURI} = require('./config/keys.js');
const users = require('./routes/api/users.js');
const profile = require('./routes/api/profile.js');
const posts = require('./routes/api/posts.js');

const app = express();
const port = process.env.PORT || 5000;
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.log(`Their was a error ${e}`));

app.set('view engine', 'ejs');
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
// Passport Config
require('./config/passport.js')(passport);

// User routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(port, () => console.log(`The MERN stack project is up on port ${port}`));