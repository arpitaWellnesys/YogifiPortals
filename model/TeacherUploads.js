var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    teacher_id :  {type : mongoose.Schema.Types.ObjectId},
    url : {type : String},
    file : {type : String}
});

var userData = mongoose.model('teacheruploads', schema);

module.exports = userData;