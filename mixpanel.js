var fs = require('fs');
var read = fs.readFile;
var zlib = require('zlib');
var Batch = require('batch');
var dirname = require('path').dirname;
var basename = require('path').basename;
var mkdirp = require('mkdirp');

var pipeline = require('./lib/pipelines/mixpanel');

var b = new Batch();

b.concurrency(1);

process.argv.slice(2).forEach(function(input) {
  b.push(parse.bind(null, input));
});

b.on('progress', function(e) {
  console.log(e.percent + '% - ', e.value);
});

b.end(function(err) {
  if (err) console.log(err.stack || err);
});

function parse(input, done) {
  var filename = basename(input).replace(/\s/g, '-');

  read(input, 'utf8', function(err, text) {
    if (err) return done(err);

    try {
      var rows = pipeline(text);
    } catch(e) {
      e.filename = input;
      return done(e);
    }

    var batch = new Batch();

    batch.concurrency(1);

    Object.keys(rows).forEach(function(collection) {
      batch.push(function(cb) {
        var out = 'enriched/' + collection + '/' + filename + '.gz';
        mkdirp(dirname(out), function(err) {
          if (err) return cb(err);
          var compression = zlib.createGzip();
          var fsOut = fs.createWriteStream(out);

          fsOut.on('finish', function() {
            cb();
          });
          fsOut.on('error', cb);
          compression.on('error', cb);

          compression.pipe(fsOut);

          rows[collection].forEach(function(row) {
            compression.write(''+row);
          });

          compression.end();
        });
      });
    });

    batch.end(function(err) {
      done(err, input);
    });
  });
}
