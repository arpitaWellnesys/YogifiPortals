var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name :  {type : String}
});

var familiarities = mongoose.model('familiarities', schema);

module.exports = familiarities;