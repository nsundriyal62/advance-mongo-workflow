var express = require('express');
var router = express.Router();

const userModel =require("./users");
const { get } = require('mongoose');
const localstrategy=require("passport-local");
const passport = require('passport');
passport.use(new localstrategy(userModel.authenticate()));

router.get('/', function(req, res) {
  res.render('index');
});  


router.get('/profile', isLoggedIn,function(req, res) {
  res.send('welcome to profile');
}); 
//advance mongodb concepts

router.get('/create', async function(req, res) {
  try {
    const createdUsers = await userModel.create([
      {
        username: "naveen",
        Password: "securePassword123",
        nickname: "Johnny",
        description: "A passionate individual exploring the world of programming.",
        categories: ["Technology", "Programming", "Web Development"],
        datecreated: new Date("2024-01-11T12:00:00Z"),
      },
      {
        username: "janenaveen",
        Password: "strongPass456",
        nickname: "Janey",
        description: "Tech enthusiast and avid reader.",
        categories: ["Technology", "Books", "AI"],
        datecreated: new Date("2024-01-12T10:30:00Z"),
      },
      {
        username: "sam_coder",
        Password: "codingMaster789",
        nickname: "Sam",
        description: "Full-stack developer with a love for open source projects.",
        categories: ["Programming", "Web Development", "Open Source"],
        datecreated: new Date("2024-01-13T15:45:00Z"),
      }
    ]);

    res.send(createdUsers);
  } catch (error) {
    console.error("Error creating users:", error);
    res.status(500).send("Internal Server Error");
  }
});



//----------------------searching case insensitive in database----------------------------------------

router.get('/find', async function(req,res){
  //so as we know default all opertions are case sensitive, so we use regular expression
  // new RegExp(value,flags);--------------->syntax
  var regx= new RegExp("naveen", "i"); // problem is that this will allow all values having naveen in it
  //sare naveen show honge bhale hee beech m ho yaa khi bhi ho

  // so we usee

  //^ -----------------> shuruwat esi ho 
  //$ -----------------> ending esi ho
  var regx1= new RegExp("^naveen$", "i"); 

  const milgya=await userModel.find({username: regx}); // this have above problem
  const accuratemilgya=await userModel.find({username: regx1}); // this will give exact match

  res.send(milgya);
});




//--------------------------------------------all person which having same categories-----------------------

router.get('/findcategories', async function(req,res){
  var data1= await userModel.find({categories:{$all: ["Technology"]}});
  res.send(data1);
});




//--------------------documents with specific range of date ---------------------------------

router.get('/finddaterange', async function(req,res){
  // date format = yyyy-mm-dd

  var date1= new Date('2024-01-14');
  var date2= new Date('2024-01-11');
  var data2= await userModel.find({datecreated: {$gte: date2, $lte: date1}});
  res.send(data2);
});

//--------------------kisi bhi property k existance k based pe filter out krke output show krna-----

router.get('/find1', async function(req,res){
  let data3= await userModel.find({nickname: {$exists: true}});
  res.send(data3);
})


//---------------finding in a range for elements-----------------

router.get('/find2', async function(req,res){
  let data4= await userModel.find({
    $expr:{
      $and:[
        {$gte: [{$strLenCP: '$nickname'},0]},
        {$lte: [{$strLenCP: '$nickname'},6]}
      ]
    }
  });
  res.send(data4);
})


//flash used on the principal of cross routing


router.get('/failed', function(req, res) {
  req.flash("age",12);
  res.send("ho gya");
}); 


router.get('/failed1', function(req, res) {
  console.log(req.flash("age"));
  res.send("check kar lodu");
});

//---------------authentication and making register route---------------------

router.get("/register", function(req,res){
  var userdata= new userModel({
    username:String,
    secret:String
  });

  userModel.register(userdata, req.body.Password)
  .then(function(registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile');
    })
  })

});

router.post("/login", passport.authenticate("local", {
  successRedirect:"/profile",
  failureRedirect: "/",
}),function(req,res){})

router.get("/logout", function(req,res,next){
  req.logOut(function(err){
    if(err){return next(err);}
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.authenticate()){
    return next();
  }
  res.redirect("/");
}






//-----------------deleting rout---------------
router.get('/delete', async function(req,res){
  await userModel.deleteMany({});
  res.send("sab ud gya dosto ");
})

module.exports = router;



