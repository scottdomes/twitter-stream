$(function() {


  var socket = io.connect('http://localhost:3000');
  socket.on('tweet', function(tweet) {
      tweetHTML = "<p>" + tweet.body + "</p>";
      $('#tweets').prepend(tweetHTML);
  });

});