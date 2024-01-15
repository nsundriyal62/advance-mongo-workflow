// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;




//-------------------------> intermediate mongodb

const mongoose= require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/intermediatemongodb");


const userscheme=mongoose.Schema({
  username:String,
  Password:String,
  nickname:String,
  description:String,
  categories:{
    type:Array,
    default:[],
  },
  datecreated:{
    type:Date,
    default:Date.now(),
  }
  
});

module.exports= mongoose.model("user",userscheme);