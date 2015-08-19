var cfp = require('../lib/parsers/cloudfront');
var cft = require('../lib/translators/cloudfront');
var snowplow = require('../lib/parsers/snowplow');
var enrichments = [
  require('../lib/enrichers/user-agent'),
  require('../lib/enrichers/referer'),
  require('../lib/enrichers/ip-address'),
];

var read = require('fs').readFileSync;
var text = read(__dirname + '/parsers/sample.log', 'utf8');

var lines = cfp(text).map(function(line) {
  if (line.error) return line;
  line = cft(line, snowplow);
  return enrichments.reduce(function(acc, fn) {
    return fn(acc);
  }, line);
});

console.log(lines);
