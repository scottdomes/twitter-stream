$(function() {

  var socket = io.connect('http://localhost:3000');
  var tweetsArray = [];
  var delay = 2000;

  $('#faster').on('click', function() {
    if (delay > 4000) {
      delay -= 2000;
    } else if (delay <= 200) {
      console.log("Zero!");
    } else {
      delay -= 500;
    }
  });

  $('#slower').on('click', function() {
    delay += 2000;
    console.log(delay);
  });

  socket.on('tweet', function(tweet) {
      tweetsArray.unshift(tweet);
  });

  var timeout = function() {
    setTimeout(function() {
      tweetHTML = "<p>" + tweetsArray.shift().body + "</p>";
      $('#tweets').prepend(tweetHTML);
      timeout();
    }, delay);
  };

  timeout();

});