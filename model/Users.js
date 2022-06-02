var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    googlefacebook_id : {type : String},
    email : {type : String},
    user_type  : {type : String},
    fcm_token : {type : String},
    is_deleted : {type : Number},
    is_verified : {type : Number},
    profile_status : {type : Number},
    otp_time : {type : Date},
    email_code : {type : Number},
    tokens : {type : Array},
    password : {type : String},
    acc_verify : {type : Number},
    first_name : {type : String},
    last_name : {type : String},
    mobile_no : {type : String}
});

var userData = mongoose.model('userregistrations', schema);

module.exports = userData;