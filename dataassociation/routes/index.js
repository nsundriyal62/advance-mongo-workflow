var express = require('express');
var router = express.Router();
const usermodel= require("./users");
const postmodel= require("./post");
const passport = require('passport');

const localStrategy= require("passport-local");
passport.authenticate(new localStrategy(usermodel.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile', isLoggedIn,function(req, res, next) {
  res.send("ban gya");
});


router.post("/register", function(req,res,next){
  const userdata= new usermodel({
    username: req.body.username,
    email: req.body.email,
    fullname:req.body.fullname,
  });
  usermodel.register(userdata, req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile"); 
    })
  })
})

router.get('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/"
})  , function(req, res, next) {
});

router.get('/logout', function(req,res,next){
  req.logout(function(err){
    if(err){return next(err)};
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}
//------------------------------below code is taught for data association--------------------------------------

// router.get('/createduser',async function(req, res, next) {
//   let createduser= await usermodel.create({
//     username: "naveen",
//     password: "securepassword",
//     posts: [
//       // "This is my first post!",
//       // "Just sharing some thoughts...",
//       // "Excited to join this community!"
//     ],
//     email: "john.doe@example.com",
//     fullname: "nitin sharma",
//   });
//   res.send(createduser);
// });

// router.get('/createdpost',async function(req, res, next) {
//   let createdpost= await postmodel.create({
//     postText: "This is sample post 2.",
//     user: "65a9043f2bdfc155bffd4645",
//   });
//   let user= await usermodel.findOne({_id: "65a9043f2bdfc155bffd4645"});
//   user.posts.push(createdpost._id);
//   await user.save();
//   res.send("done");
// });
 
// router.get('/alluserposts', async function(req, res, next) {
//   let user=await usermodel
//   .findOne({_id: "65a9043f2bdfc155bffd4645"})
//   .populate('posts');
//   res.send(user);
// });


module.exports = router;
