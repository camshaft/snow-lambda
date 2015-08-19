var maxmind = require('maxmind');
var ts = require('maxmind/lib/time_zone');

// maxmind.init(__dirname + '/ip-address/GeoIP.dat');
maxmind.init(__dirname + '/ip-address/GeoIPCity.dat');
maxmind.init(__dirname + '/ip-address/GeoIPCityv6.dat');
// maxmind.init(__dirname + '/ip-address/GeoIPv6.dat');
// maxmind.init(__dirname + '/ip-address/GeoIPASNum.dat');
// maxmind.init(__dirname + '/ip-address/GeoIPASNumv6.dat');

module.exports = function(e) {
  var l = maxmind.getLocation(e.user_ipaddress);
  e.geo_country = e.geo_country || l.countryCode;
  e.geo_region = e.geo_region || l.region;
  e.geo_city = e.geo_city || l.city;
  e.geo_zipcode = e.geo_zipcode || l.postalCode;
  e.geo_latitude = e.geo_latitude || roundGeo(l.latitude);
  e.geo_longitude = e.geo_longitude || roundGeo(l.longitude);
  e.geo_region_name = e.geo_region_name || l.regionName;
  e.geo_timezone = e.geo_timezone || ts(e.geo_country, e.geo_region);

  return e;
};

function roundGeo(num) {
  return Math.round(num * 10000) / 10000;
}
