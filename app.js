var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var twitter = require('ntwitter');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var twit = new twitter({
  consumer_key: '70iyopLmD3E9nhUr45JqFFZEJ',
  consumer_secret: '1D5qSUWHKjhlnEkgwFGlVoWXRDC6HCC9RLD3FNenKHHoX25IYO',
  access_token_key: '3540762794-zCX4XNm75rgKSdH0sqXa16vLuSs2Zo35BFTFgz9',
  access_token_secret: 'G2ZmdYVdoGh7H8fU2E16BKESviTea3soVxcCtqAQ2TWej'
});

twit.stream('statuses/filter', { track: ['love'] }, function(stream) {

  stream.on('data', function(data) {
    console.log(data);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
