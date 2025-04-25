// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  imageText: {
    type: String,
    required: true,
    trim: true,
  },
  image:{
    type:String,
  },

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },

  createdAt: {
    type: Date,
    default: Date.now, // Automatically adds current date & time
  },

  likes: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model('Post', postSchema);

