var express = require('express');
var router = express.Router();
const passport = require('passport');
const userModel =require("./users");
const postModel =require("./posts");
const upload = require("./multer");

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());

router.get('/', function(req, res, next) {
  res.render('home');
});
router.get('/index', function(req, res, next) {
  res.render('index');
});
router.get('/login', function(req, res, next) { 
  const errorMessages = req.flash("error");
  res.render("login", { error: errorMessages });
});

router.get('/feed',isLoggedIn , async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  const posts = await postModel.find()
   .populate("user")

  res.render("feed",{user,posts});
});

router.post('/upload', isLoggedIn , upload.single('file'), async (req, res) => {
    if (!req.file) 
      return res.status(400).send('No file uploaded');

    const user = await userModel.findOne({ username: req.session.passport.user });
    const post = await postModel.create({
      image: req.file.filename,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      user: user._id
    });

    user.posts.push(post._id);
    await user.save();
   
    res.redirect("/profile");
});

router.get('/profile', isLoggedIn,  async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts")
  console.log(user);
  res.render("profile",{user});
});

router.get('/add', isLoggedIn,  async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  
  res.render("add",{user});
});
router.post('/createpost', isLoggedIn, upload.single('postimage'),  async function(req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  const post = await postModel.create({
    description: req.body.description,
    title: req.body.title,
    user: user._id,
    image: req.file.filename,
  });
  
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});


router.post('/fileupload', isLoggedIn , upload.single('image'),  async function(req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile");
});

router.post("/register", function(req,res){
  const { fullname, username, email } = req.body;
  const userData = new userModel({ fullname, username, email });

  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
  })
})

router.post("/login", passport.authenticate("local", {
  successRedirect :"/profile",
  failureRedirect: "/login",
  failureFlash: true,
}),function(req,res){
   
});

router.get("/logout",function(req,res,next ){
  req.logout(function(err){
    if(err) { return next(err);}
    res.redirect('/login');
  });
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated() ) return next();
  res.redirect('/login');
}
module.exports = router;
