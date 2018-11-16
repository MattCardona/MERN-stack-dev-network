const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  avatar: {
    type: String
  },
  likes: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users"
    }
  }
  ],
  comments: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users"
    },
    text: {
      type: String,
      required: true
    },
    name: {
      type: String,
    },
    avatar: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
  ],
  date: {
      type: Date,
      default: Date.now
    }
})

const Post = mongoose.model("Posts", postSchema);
module.exports = { Post };