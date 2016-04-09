var Tweet = require('../models/Tweet');

module.exports = function(io, twit) {
  var keyword = 'love';
  var twitterStream; 

  function defineStream(keyword, socket) {
    twit.stream('statuses/filter', { track: [keyword] }, function(stream) { 
      twit.twitterStream = stream;
      twit.twitterStream.on('data', function(data) {

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

      twit.twitterStream.on('error', function(error, code) {
          console.log("My error: " + error + ": " + code);
      });
    });
  }

  function connectSocket() {
    io.on('connection', function(socket) {
      console.log('a user connected');
      socket.on('new-keyword', function(newKeyword) {
          // if (twit.twitterStream !== undefined) {
          //   twit.twitterStream.destroy(); //Deprecated to prevent too many requests
          //   console.log(twit.twitterStream.readable);
          // }
          // twitterStream = undefined;
          defineStream(newKeyword.keyword, socket);
        });

      socket.on('disconnect', function() {
        if (twit.twitterStream !== undefined) {
          twit.twitterStream.destroy();
        }
      });

    });

  }

  connectSocket();

};