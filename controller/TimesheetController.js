require('dotenv').config();
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
var user = require("../model/Users");
var emails = require("../controller/Helper/helper");
var app_url = "http://localhost:4200/";
var timesheet = require("../model/Timesheet");
var mongoose = require('mongoose');

exports.addTimesheet = ((req,res)=>{
    timesheet.create(req.body).then((responce)=>{
        return res.json({success : true , message : "Timesheet Filled" , data : responce})
    }).catch((error)=>{
        return res.json({success : false , message : "Something went wrong" , data : error})
    });
})

exports.show = ((req,res)=>{
    timesheet.find({"teacher_id" : mongoose.Types.ObjectId(req.params.id)}).then((responce)=>{
        return res.json({ success : true , message : "Timesheet Details" , data : responce});
    }).catch((err)=>{
        return res.json({ success : false , message : "Something went wrong" , data : err})
    });
})

module.exports = exports;