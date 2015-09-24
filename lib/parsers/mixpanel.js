module.exports = function(str) {
  return str
    .split('\n')
    .map(function(line) {
      return JSON.parse(line);
    });
};
