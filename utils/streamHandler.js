var Tweet = require('../models/Tweet');

module.exports = function(io, twit) {
  var keyword = 'love';
  var twitterStream; 

  function defineStream(keyword, socket) {
    console.log('defining stream');
    twit.stream('statuses/filter', { track: [keyword] }, function(stream) { 
      twitterStream = stream;
      twitterStream.on('data', function(data) {

        var tweet = {
          twid: data.id,
          active: false,
          author: data.user.name,
          avatar: data.user.profile_image_url,
          body: data.text,
          date: data.created_at,
          screenname: data.user.screen_name
        };
        socket.emit('tweet', tweet);

      });

      twitterStream.on('error', function(error, code) {
          console.log("My error: " + error + ": " + code);
      });
    });
  }

  function connectSocket() {
    io.on('connection', function(socket) {

      socket.on('new-keyword', function(newKeyword) {
          // twitterStream.destroy(); Deprecated to prevent too many requests
          if (twitterStream === undefined) {
            defineStream(newKeyword.keyword, socket);
          } else {
            twitterStream = undefined;
            defineStream(newKeyword.keyword, socket);
          }
        });

    });
  }

  connectSocket();

};