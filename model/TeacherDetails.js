var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    first_name : {type : String},
    last_name  : {type : String},
    age : {type : String},
    gender : {type : String},
    phone_number : {type : String},
    email : {type : String},
    work_location : {type : String},
    education_qualification : {type : String},
    facebook_handle : {type : String},
    instagram_handle : {type : String},
    profile_pic : {type : String},
    yoga_video : {type : String},
    appreciation_award : {type : String},
    certificate_file : {type : String},
    days : {type : Array},
    hours : {type : Array},
    profile_status : {type : Number},
    teacher_id : {type : mongoose.Schema.Types.ObjectId},
    accept : {type : Boolean},
    accreditation : {type : String},
    familarity : {type : String},
    method : {type : Array},
    specialization : {type : String},
    teaching_hours : {type : String},
    timing : {type : Array},
    primary_location : {type : String},
    yoga_style : {type : Array}
});

var userData = mongoose.model('teacherdetails', schema);

module.exports = userData;