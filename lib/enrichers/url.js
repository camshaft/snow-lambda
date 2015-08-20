var parse = require('url').parse;

module.exports = function(event, url, prefix) {
  prefix = prefix || 'page_url';
  url = url || event[prefix];
  if (!url) return event;
  if (typeof url === 'string') url = parse(url);

  var proto = event[prefix + 'scheme'] = (url.protocol || '').replace(':', '') || undefined;
  event[prefix + 'host'] = url.hostname || undefined;
  event[prefix + 'port'] = url.port || (proto === 'http' && 80) || (proto === 'https' && 443) || undefined;
  event[prefix + 'path'] = url.pathname || undefined;
  event[prefix + 'query'] = url.query || undefined;
  event[prefix + 'fragment'] = url.hash || undefined;

  return event;
}
