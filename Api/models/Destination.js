var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Destination schema
var Destination = new mongoose.Schema({
         created: { type: Date, default: Date.now },
            name: { type: String, uppercase: true, required:true },
            days: { type: Number, min: 1, required:true }
});

//Define Models
mongoose.model('Destination', Destination);