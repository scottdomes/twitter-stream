var Tweet = require('../models/Tweet');

module.exports = function(io, twit) {
  var keyword = 'love';
  var twitterStream; 

  function defineStream(keyword, socket) {
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
    });
  }

  function startStream() {
    io.on('connection', function(socket) {
      defineStream(keyword, socket);

      socket.on('new-keyword', function(newKeyword) {
          twitterStream.destroy();
          restartStream(newKeyword.keyword, socket);
        });
    });
  }

  function restartStream(keyword, socket) {
    defineStream(keyword, socket);
  }

  startStream();

};