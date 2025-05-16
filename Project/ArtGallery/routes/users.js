const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
var express = require('express');
var router = express.Router();

mongoose.connect("mongodb://127.0.0.1:27017/nayaappPinterest");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true
  },
  password:{
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profileImage:{ 
    type: String
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post' 
    }
  ]
})

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
userSchema.plugin(plm);
module.exports = mongoose.model('user',userSchema);
