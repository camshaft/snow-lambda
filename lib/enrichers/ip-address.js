var maxmind = require('maxmind');

// maxmind.init('/usr/local/share/GeoIP/GeoIP.dat');
maxmind.init('/usr/local/share/GeoIP/GeoIPCity.dat');
maxmind.init('/usr/local/share/GeoIP/GeoIPCityv6.dat');
// maxmind.init('/usr/local/share/GeoIP/GeoIPv6.dat');
// maxmind.init('/usr/local/share/GeoIP/GeoIPASNum.dat');
// maxmind.init('/usr/local/share/GeoIP/GeoIPASNumv6.dat');

module.exports = function(e) {
  var l = maxmind.getLocation(e.user_ipaddress);
  e.geo_country = e.geo_country || l.countryCode;
  e.geo_region = e.geo_region || l.region;
  e.geo_city = e.geo_city || l.city;
  e.geo_zipcode = e.geo_zipcode || l.postalCode;
  e.geo_latitude = e.geo_latitude || l.latitude;
  e.geo_longitude = e.geo_longitude || l.longitude;
  e.geo_region_name = e.geo_region_name || l.regionName;

  return e;
};