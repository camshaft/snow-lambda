var cfp = require('../parsers/mixpanel');
var cft = require('../translators/mixpanel');
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

  var i = 0;

  shredded.events = cfp(text).map(function(line) {
    if (line.error) return line;
    if (i++ % 1000 === 0) process.stdout.write('.');
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

  if (errors.length) shredded['com.snowplowanalytics.snowplow/bad_raw_event_1'] = errors;

  return shredded;
}
