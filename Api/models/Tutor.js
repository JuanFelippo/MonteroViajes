var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Tutor schema
var Tutor = new mongoose.Schema({
         created: { type: Date, default: Date.now },
            name: { type: String, required: true },
             dni: { type: Number, min: 1, required: true },
           email: { type: String },
             dob: { type: Date, default: Date.now },
         address: { type: String },
             tel: { type: String }
});

//Define Models
mongoose.model('Tutor', Tutor);