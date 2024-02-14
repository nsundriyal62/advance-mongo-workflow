const mongoose = require('mongoose');
const { stringify } = require('uuid');

// Define the post schema
const postSchema = new mongoose.Schema({
  imagetext: {
    type: String,
    required: true,
  },
  image:{
    type: String
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdat: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
});

// Create the Post model

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
 