var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Destination = mongoose.model("Destination");
var SalesAgent = mongoose.model("SalesAgent");
var ControlCenter = mongoose.model("ControlCenter");

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET contract listing. */
router.get('/', function(req, res, next) {
  var relatedData = {};
  
  Destination.find(function(err, destinations){
    if(err){ return next(err); }
    relatedData['destinations'] = destinations;

    SalesAgent.find(function(err, agents){
        if(err){ return next(err); }
           relatedData['agents'] = agents;
        ControlCenter.find(function(err, centers){
	        if(err){ return next(err); }
	        relatedData['centers'] = centers;
	        res.json(relatedData);
        }); 
    }); 
  }); 
 
  
});
/* POST contract creation. */
router.post('/', auth, function(req, res, next) {
   
  Contract.find(function(err, posts){
    if(err){ return next(err); }
    res.json({"Posts":posts});
  });  
});

module.exports = router;
