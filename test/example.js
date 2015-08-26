var pipeline = require('../lib/pipelines/default');

var read = require('fs').readFileSync;
var text = read(__dirname + '/parsers/sample.log', 'utf8');

var out = pipeline(text);

console.log(out);
