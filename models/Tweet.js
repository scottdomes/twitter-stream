var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  twid : String,
  active : Boolean,
  author : String,
  avator : String,
  body : String,
  date : Date,
  screename: String
});

// Fetches tweet data from the db
schema.statics.getTweets = function(page, skip, callback) {

  var tweets = [];
  var start = (page * 10) + (skip * 1);

  Tweet.find({}, 'twid active author avatar body data screenname', {skip: start, limit: 10}).sort({date: 'desc'}).exec(function(err, docs) {

    if (!err) {
      tweets = docs;
      tweets.forEach(function(tweet) {
        tweet.active = true;
      });
    }

    // callback(tweets); // Pass them to callback
    return tweets;
  });

};

module.exports = Tweet = mongoose.model('Tweet', schema);