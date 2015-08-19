// credit goes to https://github.com/jujhars13/node-log-dissector/blob/master/dissectors/cloudfront.js

var regex = /^(\S+)\t(\S+)\t(\S+)\t(\S+)\t(\S+)\t(\S+)\t(\S+)\t(\S+)\t(\S+)\t(\S+)\t(\S+)\t(\S+)\t(\S+)\t(\S+)\t(\S+)\t(\S+)\t(\S+)\t(\S+)\t(\S+\S+)\t(\S+)\t(\S+)\t(\S+)\t(\S+)/;

var map = [
  'date',
  'time',
  'x_edge_location',
  'sc_bytes',
  'c_ip',
  'cs_method',
  'cs_host',
  'cs_uri_stem',
  'sc_status',
  'cs_referer',
  'cs_user_agent',
  'cs_uri_query',
  'cs_cookie',
  'x_edge_result_type',
  'x_edge_request_id',
  'x_host_header',
  'cs_protocol',
  'cs_bytes',
  'time_taken',
  'x_forwarded_for',
  'ssl_protocol',
  'ssl_cipher',
  'x_edge_response_result_type'
];

module.exports = function parse(str, pixelPath) {
  pixelPath = pixelPath || '/i';
  var lines = str.split('\n');
  var out = [];
  for (var i = 0, l; i < lines.length; i++) {
    l = lines[i];
    if (!l || l.charAt(0) === '#') continue;
    l = parseLine(l);
    if (l.error || l.cs_uri_stem === pixelPath) out.push(l);
  }
  return out;
};

function parseLine(str) {
  var match = (str || '').match(regex);
  if (!match) return {error: true, line: str};
  var obj = {};
  for (var i = 0; i < map.length; i++) {
    obj[map[i]] = match[i + 1];
  }
  return obj;
};
