$(function() {

  var url = 'http://localhost:3000';
  var socket = io.connect(url);
  var tweetsArray = [];
  var tweetDelay = 2000;
  var paused = false;
  var tweetSpeed = $('#tweet-speed');

  $('#faster').on('click', function() {
    if (tweetDelay <= 250) {
      tweetDelay -= 50;
      tweetSpeed.text(tweetDelay / 1000);
    } else if (tweetDelay <= 100) {
      console.log("Zero!");
      tweetSpeed.text(tweetDelay / 1000);
    } else {
      tweetDelay -= 250;
      tweetSpeed.text(tweetDelay / 1000);
    }
  });

  $('#slower').on('click', function() {
    tweetDelay += 250;
    tweetSpeed.text(tweetDelay / 1000);
  });

  $('#pause').on('click', function() {
    if ($(this).hasClass('playing')) {
      paused = true;
      tweetsArray = [];
      $(this).addClass('paused');
      $(this).removeClass('playing'); 
      $(this).text("Resume");
    } else {
      paused = false;
      $(this).addClass('playing');
      $(this).removeClass('paused'); 
      $(this).text("Pause");   
    }
  });

  socket.on('tweet', function(tweet) {
      if (!paused) {
        tweetsArray.unshift(tweet);
      }
  });

  function postTweet() {
    if (tweetsArray.length > 0) {
      tweetHTML = "<p>" + tweetsArray.shift().body + "</p>";
      $('#tweets').prepend(tweetHTML);
    }
  }

  var timeout = function() {
    setTimeout(function() {
      postTweet();
      timeout();
    }, tweetDelay);
  };

  timeout();

});