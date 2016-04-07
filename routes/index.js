var express = require('express');
var router = express.Router();
var Tweet = require('../models/Tweet');
var tweets = Tweet.getTweets(0,0);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Express',
    tweets: tweets
  });
});

module.exports = router;
