module.exports = function(event, parse) {
  var obj = parse(event.cs_uri_query);

  obj.collector_tstamp = +(new Date(event.date + ' ' + event.time));

  // decode twice...?
  obj.useragent = decodeURIComponent(decodeURIComponent(event.cs_user_agent));

  obj.user_ipaddress = event.c_ip;

  // TOOD add additional info from request
  return obj;
};
