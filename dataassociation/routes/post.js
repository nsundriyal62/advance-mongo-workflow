const mongoose = require('mongoose');

// Define the post schema
const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
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
 