const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const {mongoURI} = require('./config/keys.js');

const users = require('./routes/api/users.js');
const profile = require('./routes/api/profile.js');
const posts = require('./routes/api/posts.js');

const app = express();
const port = process.env.PORT || 3000;
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.log(`Their was a error ${e}`));
app.set('view engine', 'ejs');
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res) => res.send("hello World wow wtf are u working"));
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(port, () => console.log(`The MERN stack project is up on port ${port}`));