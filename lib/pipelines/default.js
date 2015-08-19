var cfp = require('../parsers/cloudfront');
var cft = require('../translators/cloudfront');
var snowplow = require('../parsers/snowplow');
var enrichments = [
  require('../enrichers/user-agent'),
  require('../enrichers/referer'),
  require('../enrichers/ip-address'),
];

module.exports = function(text) {
  return cfp(text).map(function(line) {
    if (line.error) return line;
    line = cft(line, snowplow);
    line = enrichments.reduce(function(acc, fn) {
      return fn(acc);
    }, line);
    return JSON.stringify(line);
  }).join('\n');
}
