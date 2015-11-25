var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Destination schema
var ControlCenter = new mongoose.Schema({
         created: { type: Date, default: Date.now },
            name: { type: String, uppercase: true, required:true },
        location: { type: String, uppercase: true, required:true }
});

//Define Models
mongoose.model('ControlCenter', ControlCenter);