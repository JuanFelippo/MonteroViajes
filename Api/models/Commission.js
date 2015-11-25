var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SalesAgent = mongoose.model("SalesAgent");

// Destination schema
var Commission = new mongoose.Schema({
         created: { type: Date, default: Date.now },
      salesAgent: [SalesAgent.schema],
      percentage: { type: Number, min: 0, required:true }
});

//Define Models
mongoose.model('Commission', Commission);