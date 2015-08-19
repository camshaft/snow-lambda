var pipeline = require('../lib/pipelines/default');

var read = require('fs').readFileSync;
var text = read(__dirname + '/parsers/sample.log', 'utf8');

process.stdout.write(pipeline(text));
