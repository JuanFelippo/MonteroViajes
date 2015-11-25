var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
//var bcrypt = require('bcrypt');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10;

// User schema
var User = new mongoose.Schema({
           username: { type: String, required: true, unique: true },
           hash: String,
           salt: String,
 //          password: { type: String, required: true },
//           is_admin: { type: Boolean, default: false },
            created: { type: Date, default: Date.now }
});

// Bcrypt middleware on UserSchema
// User.pre('save', function(next) {
//   var user = this;

//   if (!user.isModified('password')) return next();

//   bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//     if (err) return next(err);

//     bcrypt.hash(user.password, salt, function(err, hash) {
//         if (err) return next(err);
//         user.password = hash;
//         next();
//     });
//   });
// });

//Password verification
// User.methods.comparePassword = function(password, cb) {
//     bcrypt.compare(password, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(isMatch);
//     });
// };

User.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  return this.hash === hash;
};

User.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

User.methods.generateJWT = function() {
  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};

//Define Models
mongoose.model('User', User);