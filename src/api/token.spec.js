var should = require('chai').should();
var jwt = require('jsonwebtoken');

describe('#token', function()
{
	it('basic test', function()
	{
		true.should.be.true;
	});

	it('jwt exists', function()
	{
		jwt.should.exist;
	});

	it('basic token creation', function()
	{
		// sign with default (HMAC SHA256)
		var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
		token.should.exist;
	});

	// var signingAlgorithm = 'HS512';
});