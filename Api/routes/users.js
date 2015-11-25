var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var router = express.Router();
//eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NTZiZGQyODcyNmEzOGRjMTMwNDViOWQiLCJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNDM4MzE2MzI4LCJpYXQiOjE0MzMxMzIzMjh9.lkiWhf79KbH03ZQ64Q8i8nL3YnHYoHJuX4lNHftNW4I
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', function(req, res, next){
  // if(!req.body.username || !req.body.password){
  //   return res.status(400).json({message: 'Please fill out all fields'});
  // }

  var user = new User();

  // user.username = req.body.username;

  // user.setPassword(req.body.password)
  user.username = "admin";
  user.setPassword("admin");

  user.save(function (err){
    if(err){ return next(err); }
    return res.json({token: user.generateJWT()})
  });
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }
  
  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
