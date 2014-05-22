var assert = require('assert'),
    rinco = require('./../rinco');

describe('Rinco', function () {
    it('should return false when no config file is found', function () {
        assert.equal(rinco.checkConfigFile(), false);
    });
})