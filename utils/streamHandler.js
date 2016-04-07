var Tweet = require('../models/Tweet');

module.exports = function(io, twit) {
  var keyword = 'love';

  function startStream(keyword) {
    twit.stream('statuses/filter', { track: [keyword] }, function(stream) {
      stream.on('data', function(data) {

        var tweet = {
          twid: data.id,
          active: false,
          author: data.user.name,
          avatar: data.user.profile_image_url,
          body: data.text,
          date: data.created_at,
          screenname: data.user.screen_name
        };

        var tweetEntry = new Tweet(tweet);

        // tweetEntry.save(function(err) {
        //   if (!err) {
            io.emit('tweet', tweet);
        //   }
        // });

        // Timer function
        // if (Date.now() % 100 === 0) {
          // console.log(tweet);
        // }

      });
    });
  }

  io.on('connection', function(socket) {
    socket.on('new-keyword', function(keyword) {
      twit.stream.disconnect();
      startStream(keyword);
    });
  });
  
  startStream(keyword);

};