var _ = require('lodash');
var ObjectID = require('mongodb').ObjectID;

function fixID(id)
{
	if(_.isString(id))
	{
		return ObjectID(id);
	}
	else
	{
		return id;
	}
}

module.exports = {
	fixID: fixID
};