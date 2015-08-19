var should = require('should');
var read = require('fs').readFileSync;
var parse = require('../../lib/parsers/cloudfront');

describe('parsers', function() {
  it('should work', function() {
    var text = read(__dirname + '/sample.log', 'utf8');
    var results = parse(text);
    should.exist(results);
    results.forEach(function(result) {
      should.exist(result);
      result.date.should.exist;
    });
  });
});
