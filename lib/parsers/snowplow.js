var parse = require('qs').parse;

var EVENTS = {
  pv: 'page_view',
  pp: 'page_ping',
  tr: 'transaction',
  ti: 'transaction_item',
  se: 'struct',
  ue: 'unstruct',
};

var v_etl = 'snow-lambda-' + require('../../package').version;

module.exports = function(query) {
  var obj = parse(query);

  var res_parts = (obj.res || '').split('x');
  var doc_parts = (obj.ds || '').split('x');
  var view_parts = (obj.vp || '').split('x');

  // https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol
  return {
    // Application
    app_id: obj.aid,
    platform: obj.p,

    // Date/time
    collector_tstamp: undefined,
    dvce_tstamp: obj.dtm,
    dvce_sent_tstamp: obj.stm,
    os_timezone: obj.tz,
    etl_tstamp: +(new Date),
    derived_tstamp: undefined,

    // Transaction
    event: EVENTS[obj.e] || obj.e,
    event_id: obj.eid,
    txn_id: obj.tid,

    // Snowplow version fields
    v_tracker: obj.tv,
    v_collector: undefined,
    v_etl: v_etl,
    name_tracker: obj.tna,
    etl_tags: undefined,

    // User-related fields
    user_id: obj.uid,
    domain_userid: obj.duid,
    network_userid: obj.tnuid || obj.nuid,
    user_ipaddress: obj.ip,
    domain_sessionidx: obj.vid && parseInt(obj.vid, 10),
    domain_sessionid: obj.sid,

    // Device and operating system fields
    useragent: obj.ua,
    dvce_type: undefined,
    dvce_ismobile: undefined,
    dvce_screenheight: res_parts[0] || undefined,
    dvce_screenwidth: res_parts[1] || undefined,
    os_name: undefined,
    os_family: undefined,
    os_manufacturer: undefined,

    // Location
    geo_country: undefined,
    geo_region: undefined,
    geo_city: undefined,
    geo_zipcode: undefined,
    geo_latitude: undefined,
    geo_longitude: undefined,
    geo_region_name: undefined,
    geo_timezone: undefined,

    // IP address
    ip_isp: undefined,
    ip_organization: undefined,
    ip_domain: undefined,
    ip_netspeed: undefined,

    // Web-specific
    page_url: obj.url,
    page_urlscheme: undefined,
    page_urlhost: undefined,
    page_urlport: undefined,
    page_urlpath: undefined,
    page_urlquery: undefined,
    page_urlfragment: undefined,
    page_referrer: obj.refr,
    page_title: obj.page,

    refr_urlscheme: undefined,
    refr_urlhost: undefined,
    refr_urlport: undefined,
    refr_urlpath: undefined,
    refr_urlquery: undefined,
    refr_urlfragment: undefined,
    refr_medium: undefined,
    refr_source: undefined,
    refr_term: undefined,
    refr_domain_userid: undefined,
    refr_dvce_tstamp: undefined,

    doc_charset: obj.cs,
    doc_width: doc_parts[0] || undefined,
    doc_height: doc_parts[1] || undefined,

    mkt_medium: undefined,
    mkt_source: undefined,
    mkt_term: undefined,
    mkt_content: undefined,
    mkt_campaign: undefined,
    mkt_clickid: undefined,
    mkt_network: undefined,

    user_fingerprint: obj.fp,
    connection_type: obj.ctype,
    cookie: undefined,
    br_name: undefined,
    br_version: undefined,
    br_family: undefined,
    br_type: undefined,
    br_renderengine: undefined,
    br_lang: obj.lang,
    br_features_pdf: obj.f_pdf,
    br_features_flash: obj.f_fla,
    br_features_java: obj.f_java,
    br_features_director: undefined,
    br_features_quicktime: obj.f_qt,
    br_features_realplayer: obj.f_realp,
    br_features_windowsmedia: obj.f_wma,
    br_features_gears: obj.f_gears,
    br_features_silverlight: obj.f_ag,
    br_cookies: obj.cookie,
    br_colordepth: obj.cd,
    br_viewheight: view_parts[0] || undefined,
    br_viewwidth: view_parts[1] || undefined,

    // Page pings
    pp_xoffset_min: obj.pp_mix,
    pp_xoffset_max: obj.pp_max,
    pp_yoffset_min: obj.pp_miy,
    pp_yoffset_max: obj.pp_may,

    // Ecommerce
    // TODO

    // Custom structure
    se_category: obj.se_ca || obj.ev_ca,
    se_action: obj.se_ac || obj.ev_ac,
    se_label: obj.se_la || obj.ev_la,
    se_property: obj.se_pr || obj.ev_pr,
    se_value: obj.se_va || obj.ev_va,

    unstruct_event: obj.ue_px ? decode(obj.ue_px) : obj.ue_pr,

    // Contexts
    context: obj.cx ? decode(obj.cx) : obj.co,
    derived_contexts: undefined
  };
};

function decode(str) {
  return (new Buffer(str, 'base64')).toString();
}
