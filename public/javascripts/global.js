$(function() {

  var url = 'http://localhost:3000';
  var socket = io.connect(url);
  var tweetsArray = [];
  var tweetDelay = 2000;
  var paused = true;
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

  $('#form-set-keyword').on('submit', function(e) {
    e.preventDefault();
    var keyword = $(this).children('input').val();
    newKeyword(keyword);
    $('#current-keyword').show();
    $(this).hide();
  });

  socket.on('tweet', function(tweet) {
      if (!paused) {
        tweetsArray.unshift(tweet);
      }
  });

  function newKeyword(key) {
    paused = false;
    tweetsArray = [];
    $('#tweetFlash').text("Waiting for tweets.");
    $('#tweetFlash').hide();
    $('#current-keyword').text(key);
    socket.emit('new-keyword', { keyword: key });
  }

  function postTweet() {
    var flash = $('#tweetFlash');

    if (tweetsArray.length > 0) {
      console.log("Tweet has length");
      var theTweet = tweetsArray.shift();

      flash.hide();

      tweetHTML = 
        "<div class=\"well tweet\">" + 
          "<img src=\"" +
            theTweet.avatar +
          "\"></img>" +
          "<h4>" +
            theTweet.author +
          "</h4>" +
          "<h5> <a href=\"http://twitter.com/" +
            theTweet.screenname +
          "\">@" +
            theTweet.screenname +
          "</a></h5>" +
          "<p>" +
            theTweet.body + 
          "</p>" +
        "</div>";
      $('#tweets').prepend(tweetHTML);
    } else {
      flash.show();
    }
  }

  function animateIcon() {
    var icon = $('.navbar .glyphicon');
    icon.css({
      'webkit-animation': 'spin ' + (tweetDelay / 2000) + 's 1 linear',
      '-moz-animation': 'spin ' + (tweetDelay / 2000) + 's 1 linear',
      '-o-animation': 'spin ' + (tweetDelay / 2000) + 's 1 linear',
      'animation': 'spin ' + (tweetDelay / 2000) + 's 1 linear'
      });
    setTimeout(function() {
      icon.css({
      'webkit-animation': '',
      '-moz-animation': '',
      '-o-animation': '',
      'animation': ''
      });
    }, (tweetDelay / 2));
  }

  var timeout = function() {
    setTimeout(function() {
      postTweet();
      if (!paused) {
        animateIcon();
      }
      timeout();
    }, tweetDelay);
  };

  timeout();

});