require('dotenv').config();
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
var user = require("../model/Users");
var emails = require("../controller/Helper/helper");
var app_url = "http://localhost:4200/";
var profile = require("../model/TeacherDetails");
var mongoose = require('mongoose');

exports.profile = ((req,res)=>{
    console.log(JSON.stringify(req.body));
    profile.findOne({"teacher_id" : req.body.teacher_id}).then((profiledata)=>{
        console.log(profiledata);
        if(profiledata){
            profile.findOneAndUpdate({ _id : profiledata._id }, {$set : req.body}).then((users)=>{
                console.log(users);
                user.findOneAndUpdate({_id : mongoose.Types.ObjectId(req.body.teacher_id)},{$set : {profile_status : 1 , first_name : req.body.first_name , last_name : req.body.last_name , mobile_no : req.body.phone_number}}).then((data)=>{
                    user.findById(req.body.teacher_id).then((data)=>{
                        return res.json({ success : true, message : "Profile Updated Successfully!!", data : data });
                    }).catch((error) => {
                        return res.json({ success : false, message : "User Not Found!!", data : error });
                    });
                }).catch((error) => {
                    return res.json({ success : false, message : "User Not Found!!", data : error });
                });
               
                // return res.json({ success : true, message : "Profile Created Successfully!!", data : users });
            }).catch((error) => {
                return res.json({ success : false, message : "Something went wrong1!", data : error });
            });  
        } else{
            profile.create(req.body).then((users)=>{
                user.findOneAndUpdate({_id : mongoose.Types.ObjectId(users.teacher_id)},{$set : {profile_status : 1 , first_name : req.body.first_name , last_name : req.body.last_name , mobile_no : req.body.phone_number}}).then((data)=>{
                    return res.json({ success : true, message : "Profile Created Successfully!!", data : data });
                }).catch((error) => {
                    return res.json({ success : false, message : "User Not Found!!", data : error });
                });
                // return res.json({ success : true, message : "Profile Created Successfully!!", data : users });
            }).catch((error) => {
                return res.json({ success : false, message : "Something went wrong2!", data : error });
            }); 
        }
    }).catch((error) => {
        return res.json({ success : false, message : "Something went wrong4!", data : error });
    });    
});

exports.profileDetails = ((req,res)=>{
    console.log(req.params.id);
    profile.findOne({teacher_id : mongoose.Types.ObjectId(req.params.id)}).then((resss)=>{
        return res.json({ success : true, message : "Profile Details", data : resss });
    }).catch((err)=>{
        return res.json({ success : false, message : "Something went wrong!!!!!!!!", data : err });
    })
})  

module.exports = exports;

