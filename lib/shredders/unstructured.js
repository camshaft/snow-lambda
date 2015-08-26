

module.exports = function(event, shredded, errors) {
  var ue = parse(event.unstruct_event);

  if (!ue) return;

  if ((ue.schema || '').indexOf('iglu:com.snowplowanalytics.snowplow/unstruct_event/jsonschema/1') === 0) ue = ue.data;

  var schema = load(ue.schema);

  if (!schema) {
    errors.push(JSON.stringify({
      schema: {
        vendor: 'com.snowplowanalytics.snowplow',
        name: 'bad_raw_event',
        format: 'jsonschema',
        version: '1-0-0'
      },
      hierarchy: {
        rootId: event.event_id,
        rootTstamp: event.collector_tstamp,
        refRoot: 'events',
        refTree: JSON.stringify(['events', 'bad_raw_event']),
        refParent: 'events'
      },
      data: {
        line: '',
        errors: JSON.stringify(['Unknown schema ' + JSON.stringify(ue.schema)])
      }
    }));
    return;
  }

  ue.schema = schema.self;
  ue.hierarchy = {
    rootId: event.event_id,
    rootTstamp: event.collector_tstamp,
    refRoot: 'events',
    refTree: JSON.stringify(['events', schema.self.name]), // is this really needed?
    refParent: 'events'
  };

  // TODO validate the data fields?

  var name = format(schema.self);

  (shredded[name] = shredded[name] || []).push(JSON.stringify(ue));
};

function parse(ue) {
  try {
    return JSON.parse(ue);
  } catch (e) { }
}

function load(schema) {
  try {
    return require(schema.replace(/^iglu\:/, 'data-lake/') + '.json');
  } catch (e) {}
}

function format(self) {
  return self.vendor + '/' + self.name.replace(/[\-\.\/]/g, '_') + '_' + self.version.split('-')[0];
}
