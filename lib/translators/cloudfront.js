module.exports = function(event, parse) {
  var obj = parse(event.cs_uri_query);

  obj.event_id = obj.event_id || (event.x_edge_location + '|' + event.x_edge_request_id);
  obj.v_collector = 'cf';
  obj.collector_tstamp = +(new Date(event.date + ' ' + event.time));
  obj.useragent = decode(event.cs_user_agent);
  obj.user_ipaddress = event.c_ip;
  obj.page_url = obj.page_url || event.cs_referer;

  return obj;
};

function decode(text) {
  try {
    return decodeURIComponent(text)
  } catch (_) {
    return text;
  }
}
