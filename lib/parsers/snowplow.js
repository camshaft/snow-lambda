var parse = require('qs').parse;

var EVENTS = {
  pv: 'page_view',
  pp: 'page_ping',
  // TODO add the rest
};

module.exports = function(query) {
  var obj = parse(query);

  var res_parts = (obj.res || '').split('x');

  // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol
  return {
    // Application
    app_id: obj.aid,
    platform: obj.p,

    // Date/time
    collector_tstamp: null,
    dvce_tstamp: obj.dtm,
    dvce_sent_tstamp: obj.stm,
    os_timezone: obj.tz,
    etl_tstamp: null,
    derived_tstamp: null,

    // Transaction
    event: EVENTS[obj.e] || obj.e,
    event_id: obj.eid,
    txn_id: obj.tid,

    // Snowplow version fields
    v_tracker: obj.tv,
    v_collector: null,
    v_etl: null,
    name_tracker: obj.tna,
    etl_tags: null,

    // User-related fields
    user_id: obj.uid,
    domain_userid: obj.duid,
    network_userid: obj.tnuid || obj.nuid,
    user_ipaddress: obj.ip,
    domain_sessionidx: obj.vid,
    domain_sessionid: obj.sid,

    // Device and operating system fields
    useragent: obj.ua,
    dvce_type: null,
    dvce_ismobile: false,
    dvce_screenheight: res_parts[0],
    dvce_screenwidth: res_parts[1],
    os_name: null,
    os_family: null,
    os_manufacturer: null,

    // Location
    geo_country: null,
    geo_region: null,
    geo_city: null,
    geo_zipcode: null,
    geo_latitude: null,
    geo_longitude: null,
    geo_region_name: null,
    geo_timezone: null,

    // IP address
    ip_isp: null,
    ip_organization: null,
    ip_domain: null,
    ip_netspeed: null,

    // TODO add the rest https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol#2-platform-specific-parameters
    //                   https://github.com/snowplow/snowplow/wiki/canonical-event-model#22-platform-specific-fields
  };
};
