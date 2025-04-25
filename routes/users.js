
// models/User.js
const mongoose = require('mongoose');
const plm=require("passport-local-mongoose");


mongoose.connect("mongodb://127.0.0.1:27017/newappmodel")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  profilePic: {
    type: String,
    default: 'default.jpg'
  },
  password: {
    type: String,
   
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', 
    }
  ],

  dp: {
    type: String, // URL to the display picture
    default: '', // or provide a default image URL
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  fullname: {
    type: String,
    required: true,
    trim: true,
  },
},
{
  timestamps: true, // adds createdAt and updatedAt fields
});


userSchema.plugin(plm);
module.exports=mongoose.model('User', userSchema);

