const mongoose = require('mongoose');
const plm =require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/nayaappfordataassociation");


// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Post"
}],
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dp: {
    type: String,
  },
  fullname:{
    type:String,
    required: true,
  },
});
 
userSchema.plugin(plm);
const User = mongoose.model('User', userSchema);

module.exports = User;
