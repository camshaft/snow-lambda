var createHash = require('crypto').createHash;

var translators = {
  'Clicked view breakdown': function(event, o) {
    o.unstruct_event = {
      schema: schema('poll', 'view_breakdown'),
      data: {
        poll_id: event.properties.poll
      }
    };
  },
  'Cloned poll': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        new_poll_id: event.properties.poll,
        source_poll_id: event.properties.source,
        organization_id: event.properties.org
      }
    };
  },
  'Created poll': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        poll_id: event.properties.poll
      }
    };
  },
  'Deleted poll': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        poll_id: event.properties.poll
      }
    };
  },
  'Logged in': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        poll_id: event.properties.poll
      }
    };
  },
  'Published poll': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        poll_id: event.properties.poll
      }
    };
  },
  'Shared poll': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        poll_id: event.properties.poll
      }
    };
  },
  'Signed up': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        poll_id: event.properties.poll
      }
    };
  },
  'Skipped demographic info': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        poll_id: event.properties.poll
      }
    };
  },
  'Submitted demographic info': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        poll_id: event.properties.poll
      }
    };
  },
  'Unpublished poll': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        poll_id: event.properties.poll
      }
    };
  },
  'Updated poll': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        poll_id: event.properties.poll
      }
    };
  },
  'Viewed ages': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        poll_id: event.properties.poll
      }
    };
  },
  'Viewed breakdown': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        poll_id: event.properties.poll
      }
    };
  },
  'Viewed country region': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        poll_id: event.properties.poll
      }
    };
  },
  'Viewed genders': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        poll_id: event.properties.poll
      }
    };
  },
  'Viewed world region': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        poll_id: event.properties.poll
      }
    };
  },
  'Voted on poll': function(event, o) {
    o.unstruct_event = {
      schema: schema('creation.poll', 'publish'),
      data: {
        poll_id: event.properties.poll
      }
    };
  }
}

var v_tracker = 'mixpanel-' + require('../../package').version;

module.exports = function(event, parse) {
  var o = parse('e=ue');
  var props = event.properties;

  o.event_id = hash(event.event, props.time, props.distinct_id);
  o.dvce_tstamp = o.collector_tstamp = +(new Date(props.time * 1000));
  o.name_tracker = 'mixpanel';
  o.v_tracker = v_tracker;

  var user_id = parseInt(props.distinct_id);
  if (isNaN(user_id)) {
    o.network_userid = props.distinct_id;
  } else {
    o.user_id = props.distinct_id;
  }

  o.br_name = props.browser_name;
  o.os_name = props.browser_os;

  o.geo_country = props.mp_country_code;
  o.geo_region = props.$region;
  o.geo_city = props.$city;

  o.page_url = props.referer;

  translators[event.event](event, o);

  return o;
}

function schema(namespace, event, version) {
  version = version || '1-0-0';
  return 'iglu:com.boombox.' + namespace + '/' + event + '/jsonschema/' + version + '.json';
}


function hash() {
  return createHash('sha1').update(Array.prototype.join.call(arguments, ' ')).digest('base64');
}
