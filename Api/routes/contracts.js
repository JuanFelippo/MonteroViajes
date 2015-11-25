var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Contract = mongoose.model('Contract');
var Tutor = mongoose.model('Tutor');
var SalesAgent = mongoose.model('SalesAgent');
var Destination = mongoose.model('Destination');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var expressValidator = require('express-validator');
var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'jafelippo@gmail.com',
        pass: 'universidad1'
    }
});

var mailOptions = {
    from: 'jafelippo@gmail.com', // sender address
    to: 'jafelippo@gmail.com', // list of receivers
    //to : 'monteroviajes@yahoo.com.ar',
    subject: 'Contrato Espera ✔', // Subject line
   // text: 'Un Contrato ha sido subido y espera aprobación ✔', // plaintext body
};

/* GET contract listing. */
router.get('/', function(req, res, next) {
   
  Contract.find(function(err, posts){
    if(err){ return next(err); }
    res.json({"contracts":posts});
    
  });  

});

/* GET contract by id*/
router.get('/:id', function(req, res, next) {
  
   var id = req.params.id || '';
    if (id == '') {
        return res.send(400);
    }

  Contract.findById(id,function(err, contract){
    if(err){ return res.sendStatus(400);}
    res.json({"contract":contract});
  }); 

});

/* PUT update contract. */
router.put('/', function(req, res, next) {
   
    var id = req.body.contract._id || '';
    if (id == '') {
        return res.send(400);
    }

    var query = {"_id": id};
    delete req.body.contract._id;
    var update = req.body.contract;
    var options = {new: true};

    Contract.findOneAndUpdate(query, update, options, function(err, person) {
      if (err) {
        console.log('got an error');
      }

      // mailOptions.text: 'Un Contrato ha sido modificado';
      // mailOptions.html: '<b>Un Contrato ha sido modificado</b>';
      // transporter.sendMail(mailOptions, function(error, info){
      //       if(error){
      //           console.log(error);
      //       }else{
      //           console.log('Message sent: ' + info.response);
      //       }
      // });
      res.sendStatus(200);
    });
});

/* POST upload attachment. *///auth,
router.post('/attachment', function(req, res, next) {
       
       var path = req.files.file.path;
       console.log('IN POST '+JSON.stringify(path));

       if(req.files && path)
          return res.json({'path':path});
       else
          return res.sendStatus(400);
//        var filesUploaded = 0;
});

router.post('/',function(req, res, next) {
   //required fields validation
    // req.checkBody('contract.school', 'Invalid school').notEmpty();
    // req.checkBody('contract.course', 'Invalid course').notEmpty().isInt();
    // req.checkBody('contract.tripDate', 'Invalid tripDate').notEmpty().isDate();
    // req.checkBody('contract.originalPrice', 'Invalid originalPrice').notEmpty().isFloat();
    // req.checkBody('contract.firstTutor.name', 'Invalid tutorName').notEmpty();
    // req.checkBody('contract.firstTutor.dni', 'Invalid tutorDNI').notEmpty();
    // req.checkBody('contract.secondTutor.name', 'Invalid tutorName').notEmpty();
    // req.checkBody('contract.secondTutor.dni', 'Invalid tutorDNI').notEmpty();
    

    //var reqContract = req.body;

   var contract = new Contract(req.body.contract);
   contract.save(function(err, savedContract){
        if(err){ return next(err); }
           // send mail with defined transport object
        mailOptions['html'] = '<a href="http://127.0.0.1:8887/index.html#/app/contract/'+savedContract.id+'"><b>Un Contrato ha sido subido y espera aprobación ✔</b></a>'; // html body
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
            }
        });
        res.json(savedContract);
    });
});

module.exports = router;
