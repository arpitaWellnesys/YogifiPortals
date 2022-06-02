var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    date : {type : Date},
    checkin : {type : String},
    checkout : {type : String},
    description : {type : String },
    teacher_id : {type : mongoose.Schema.Types.ObjectId},
});

var userData = mongoose.model('timesheet', schema);

module.exports = userData;