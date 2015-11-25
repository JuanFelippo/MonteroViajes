var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Tutor = mongoose.model("Tutor");
var Commission = mongoose.model("Commission");
var Destination = mongoose.model("Destination");
// Contract schema
var Contract = new Schema({
         created: { type: Date, default: Date.now },
         updated: { type: Date, default: Date.now },
        signDate: { type: Date, default: Date.now },
          school: { type: String, required:true },
          course: { type: Number, min: 1, required:true },
          letter: { type: String, required:true, uppercase : true },
           shift: { type: String},
     destination: [Destination.schema],
        tripDate: { type: Date},
          tutors: [Tutor.schema],
  // controlCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'ControlCenter' },
     //  firstTutor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' },
     // secondTutor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' },
   originalPrice: { type: Number, required: true },
    updatedPrice: { type: Number },
        approved: { type: Boolean },
   attachmentURL: { type: String },
         comment: { type: String },
     commissions: [Commission.schema]
     // passengers: [User.schema]
});

Contract.pre('save', function(next, done){
  if (this.isNew) {
    this.created = Date.now();
    this.updatedPrice = this.originalPrice;
  }
  this.updated = Date.now();
  next();
});
//Define Models
mongoose.model('Contract', Contract);