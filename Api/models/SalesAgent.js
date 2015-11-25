var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// SalesAgent schema
var SalesAgent = new mongoose.Schema({
         created: { type: Date, default: Date.now },
         updated: { type: Date, default: Date.now },
            name: { type: String, required: true },
             dni: { type: Number, min: 1, required: true },
           email: { type: String},
             dob: { type: Date },
         address: { type: String },
             tel: { type: String }
   //serviceCharge: { type: Number, min: 1, max: 100, required: true }
});

SalesAgent.pre('save', function(next, done){
  if (this.isNew) {
    this.created = Date.now();
  }
  this.updated = Date.now();
  next();
});
//Define Models
mongoose.model('SalesAgent', SalesAgent);