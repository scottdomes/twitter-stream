$(function() {

  var socket = io.connect('http://localhost:3000');
  var tweetsArray = [];
  var delay = 2000;
  
  socket.on('tweet', function(tweet) {
      tweetsArray.unshift(tweet);
  });

  setInterval(function() {
    tweetHTML = "<p>" + tweetsArray.shift().body + "</p>";
    $('#tweets').prepend(tweetHTML);
  }, delay);

});