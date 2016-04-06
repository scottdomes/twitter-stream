module.exports = function(stream, io) {
  stream.on('data', function(data) {
    console.log(data);
  });
};