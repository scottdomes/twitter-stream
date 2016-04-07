$(function() {

  var url = 'http://localhost:3000';
  var socket = io.connect(url);
  var tweetsArray = [];
  var tweetDelay = 2000;
  var paused = false;
  var tweetSpeed = $('#tweet-speed');

  $('#faster').on('click', function() {
    if (tweetDelay <= 250 && tweetDelay > 50) {
      tweetDelay -= 50;
      tweetSpeed.text(tweetDelay / 1000);
    } else if (tweetDelay === 50) {
      tweetDelay -= 50;
      $('#tweet-counter').hide();
      $('#realtime').css('display', 'inline-block');
    } else if (tweetDelay > 250) {
      tweetDelay -= 250;
      tweetSpeed.text(tweetDelay / 1000);
    }
  });

  $('#slower').on('click', function() {
    if (tweetDelay === 0) {
      $('#realtime').hide();
      $('#tweet-counter').css('display', 'inline-block');
    }
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
      var theTweet = tweetsArray.shift();
      tweetHTML = 
        "<div class=\"well tweet\">" + 
          "<img src=\"" +
            theTweet.avatar +
          "\"></img>" +
          "<h4>" +
            theTweet.author +
          "</h4>" +
          "<h5>@" +
            theTweet.screenname +
          "</h5>" +
          "<p>" +
            theTweet.body + 
          "</p>" +
        "</div>";
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