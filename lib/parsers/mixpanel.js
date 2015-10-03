module.exports = function(str) {
  return str
    .split('\n')
    .reduce(function(acc, line) {
      if (line) acc.push(JSON.parse(line));
      return acc;
    }, []);
};
