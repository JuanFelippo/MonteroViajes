var express = require('express');
var app = express();
var multer  = require('multer');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var fs = require('fs');
var models_path = process.cwd() + '/models';
var expressValidator = require('express-validator');

//connect to local mongodb database
var db = mongoose.connect('mongodb://localhost/montero');

//Models
// fs.readdirSync(models_path).forEach(function (file) {
//     if (~file.indexOf('.js'))
//         require(models_path + '/' + file)
// });
require('./models/Tutor');
require('./models/Destination');
require('./models/SalesAgent');
require('./models/User');
require('./models/ControlCenter');
require('./models/Commission');
require('./models/Contract');


require('./config/passport');

//Routes
var routes = require('./routes/index');
var users = require('./routes/users');
var contracts = require('./routes/contracts');
var relatedData = require('./routes/relateddata');

app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8887');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' == req.method) return res.sendStatus(200);
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ 
    dest: './uploads/',
    rename: function (fieldname, filename) {
      console.log('renaming');
        return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
    },
    onFileUploadStart: function (file) {
        console.log(file.fieldname + ' is starting ...')
    },
    onFileUploadData: function (file, data) {
        console.log(data.length + ' of ' + file.fieldname + ' arrived')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
    }
}));
app.use(cookieParser());
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));
app.use(passport.initialize());
app.use('/', routes);
app.use('/contracts', contracts);
app.use('/users', users);
app.use('/relateddata', relatedData);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  if(req.path !== "/uploads"){
   var err = new Error('Not Found');
    return res.sendStatus(404);
  }
  
  next();
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
