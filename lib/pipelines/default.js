var cfp = require('../parsers/cloudfront');
var cft = require('../translators/cloudfront');
var snowplow = require('../parsers/snowplow');
var enrichments = [
  require('../enrichers/user-agent'),
  require('../enrichers/url'),
  require('../enrichers/marketing'),
  require('../enrichers/referer'),
  require('../enrichers/ip-address'),
];
var shredders = [
  require('../shredders/unstructured'),
  // require('../shredders/contexts')
];

module.exports = function(text, tags) {
  if (tags) tags = JSON.stringify(tags);
  var shredded = {};
  var errors = [];

  shredded.events = cfp(text).map(function(line) {
    if (line.error) return line;
    line = cft(line, snowplow);
    line.etl_tags = tags;
    line = enrichments.reduce(function(acc, fn) {
      return fn(acc);
    }, line);
    shredders.forEach(function(shredder) {
      shredder(line, shredded, errors);
    });
    return JSON.stringify(line);
  });

  if (errors.length) shredded.errors = errors;

  for (var k in shredded) {
    shredded[k] = shredded[k].join('\n');
  }

  return shredded;
}
