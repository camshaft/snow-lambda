var parse = require('qs').parse;

module.exports = function(event) {
  if (!event.page_urlquery) return event;
  var utm = parse(event.page_urlquery);
  event.mkt_medium = utm.utm_medium;
  event.mkt_source = utm.utm_source;
  event.mkt_term = utm.utm_term;
  event.mkt_content = utm.utm_content;
  event.mkt_campaign = utm.utm_campaign;
  return event;
};
