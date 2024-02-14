var express = require('express');
var router = express.Router();
const usermodel= require("./users");
const postmodel= require("./post");
const passport = require('passport');
const upload = require('./multer');


const localStrategy= require("passport-local");
passport.use(new localStrategy(usermodel.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user= await usermodel.findOne({
    username: req.session.passport.user
  });
  res.render('profile',  { user } );
});

router.get('/login',function(req, res, next) {
  res.render('login', { error: req.flash('error') });
});

router.get('/feed',function(req, res, next) {
  res.render('feed');
});

router.post('/upload', isLoggedIn, upload.single('file'), async function(req, res, next) {
  if(!req.file){
    res.status(404).send("no files are given");
  }
  res.send("file send successfully");
  // jo file upload hui h use save kro as a post and uska postid user ko do and post ko userid do
 const user= await usermodel.findOne({username: req.session.passport.user});
 const post= await postmodel.create({
  image: req.file.filename,
  imagetext: req.body.filecaption,
  user: user._id
 })

 user.posts.push(post._id);
 await user.save();
 res.send("done");
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
});

router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
}), function(req, res, next) {
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
  res.redirect("/login");
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
