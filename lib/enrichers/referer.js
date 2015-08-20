var Referer = require('referer-parser');
var url = require('./url');

module.exports = function(e) {
  if (!e.page_referrer) return e;
  var r = new Referer(e.page_referrer, e.page_url);

  e = url(e, r.uri, 'refr_url');

  e.refr_medium = r.medium;
  e.refr_source = r.referer;
  e.refr_term = r.search_term;

  return e;
};
