var express = require('express');
var router = express.Router();
const userModel =require('./users')
const postModel =require("./posts")
const passport=require("passport")
const upload =require("./multer")

const localStrategy= require("passport-local")
passport.use(new localStrategy(userModel.authenticate()));



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// router.get('/login', function(req, res, next) {
//   res.render("login",{error:req.flash('error')});
// });

router.get('/login', function(req, res, next) {
  console.log("FLASH ERROR:", req.flash('error'));  // Debug line
  res.render("login", { error: req.flash('error') });
});


router.get('/feed', function(req, res, next) {
  res.render("feed");
});
router.post('/upload',isLoggedIn,upload.single("file"),async function(req, res, next) {
  console.log("upload route hit ");
  
  if(!req.file){
     return res.status(404).send("no files were given");
  }
  const user=await userModel.findOne({username:req.session.passport.user})
  const postdata = await postModel.create({
    image:req.file.filename,
    imageText:req.body.filecaption,
    userid:user._id,
  });
  user.posts.push(postdata._id);
  await user.save();
  // res.send("done");
  res.redirect("/addpost")
});

// Profile picture upload route
router.post('/upload-profile-pic', upload.single('profilePic'), async (req, res) => {
  try {
    const user = req.user; // assuming you're using passport or session
    user.profilePic = req.file.filename;
    await user.save();
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading image');
  }
});
//googlr auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful login
    res.redirect('/dashboard'); // or your homepage
  }
);

// Facebook Auth
router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

router.get("/upload-form", (req, res) => {
  res.render("profile");  // your EJS file with the form
});

router.get('/addpost', (req, res) => {
  res.render('addpost'); // or res.send("Add Post Page") if you're not using a template
});



// router.get('/login', function(req, res, next) {
//   console.log("Flash error:", req.flash("error"));
//   res.render("login");
// });
 
router.get('/testflash', function(req, res){
  req.flash("error", "This is a test flash message!");
  res.redirect("/login");
});



router.get('/profile', isLoggedIn, async function(req, res, next) {

  const user=await userModel.findOne({
    username:req.session.passport.user
  }) 
  .populate("posts")
  console.log(user);
  res.render("profile",{ user: user });
});

router.post("/register",function(req,res){
  const{username,email,fullname}=req.body;
  const userData= new userModel({username,email,fullname});

  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })
})

router.post("/login",passport.authenticate("local",{

  successRedirect:"profile",
  failureRedirect:"/login",
  failureFlash:true,
}),function(req,res){

});

router.get("/logout",function(req,res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/")
}



//data association code 

// router.get('/allposts',async function(req,res,next){
//   let user = 
//   await userModel.findOne({_id:"6804e019c69721d2c2583862"})
//   .populate("posts");
//   res.send(user);
// })

  
// router.get("/createuser", async function(req,res,next){

//   let createduser=await userModel.create({
//      username: "Dhruv",
//       password: "Dhruvbhai",
//       posts:[],
//       email:"Dhruv@mail.com",
//       fullname: "Dhruv Singh Gandas",
//   });
//   res.send(createduser)
// });

// router.get("/createpost", async function(req,res,next){

//   let createdpost=await postModel.create({
//      postText:"hello eaur sab theek thak bhai ",
//      user:"6804e019c69721d2c2583862",
//   });
//   let user = await userModel.findOne({_id:"6804e019c69721d2c2583862"});
//   user.posts.push(createdpost._id);
//   await user.save();
//   res.send('done');
  
// });

module.exports = router;
