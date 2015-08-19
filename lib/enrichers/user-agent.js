var parser = require('useragent');

module.exports = function(e) {
  var i = parser.lookup(e.useragent);

  e.br_name = e.br_name || i.toAgent();
  e.br_version = e.br_version || i.toVersion();
  e.br_family = e.br_family || i.family;
  // TODO what are the valid types here?
  // e.br_type = 'Browser';

  e.os_name = e.os_name || i.os.toString();
  e.os_family = e.os_family || i.os.family;
  // TODO can we get this?
  e.os_manufacturer = '';

  // TODO can we infer these?
  // dvce_ismobile
  // dvce_type

  return e;
};
