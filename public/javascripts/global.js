$(function() {

  var url = 'http://localhost:3000';
  var socket = io.connect(url);
  var tweetsArray = [];
  var delay = 2000;
  var paused = false;

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

  var timeout = function() {
    setInterval(function() {
      if (tweetsArray.length > 0) {
        tweetHTML = "<p>" + tweetsArray.shift().body + "</p>";
        $('#tweets').prepend(tweetHTML);
      }
    }, delay);
  };

  timeout();

});