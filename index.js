/**
 * Module dependencies
 */

var pipeline = require('./lib/pipelines/default');
var AWS = require('aws-sdk');
var zlib = require('zlib');
var s3 = new AWS.S3();

exports.handler = function(event, context) {
  var bucket = event.Records[0].s3.bucket.name;
  var key = event.Records[0].s3.object.key;
  key = decodeURIComponent(key.replace(/\+/g, " "));
  s3.getObject({
    Bucket: bucket,
    Key: key
  }, function(err, response) {
    if (err) return context.fail(err);
    zlib.gunzip(response.Body, function(err, logs) {
      if (err) return context.fail(err);
      var rows = pipeline(logs.toString());
      zlib.gzip(rows, function(err, compressed) {
        if (err) return context.fail(err);
        s3.putObject({
          Bucket: bucket,
          Key: key.replace('logs/', 'enriched/'),
          Body: compressed,
          ContentType: 'application/x-gzip'
        }, function(err) {
          context.done(err);
        });
      });
    });
  });
};
