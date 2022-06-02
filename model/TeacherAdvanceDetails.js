var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    education_qualification : {type : String},
    familarity : {type : String},
    method  : {type : String},
    specialization : {type : String},
    teaching_hours : {type : String},
    phone_number : {type : String},
    profile_status : {type : Number},
    teacher_id : {type : String}
});

var userData = mongoose.model('teacheradvancedetails', schema);

module.exports = userData;