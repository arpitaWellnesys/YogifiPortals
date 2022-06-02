require('dotenv').config();
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
var user = require("../model/Users");
var teacher = require("../model/TeacherDetails");
var emails = require("../controller/Helper/helper");
var app_url = "http://localhost:4200/";
var mongoose = require('mongoose');
var uploads = require('../model/TeacherUploads');

exports.details = ((req,res)=>{
  token = req.headers['x-access-token'];
  console.log(token);
  jwt.verify(token, process.env.TOKEN_KEY, function(err, decoded) {      
    if (err) {
      return res.json({ success: false, message: 'Failed to authenticate token.' });    
    } else {
      if(decoded != ""){
        if(decoded.user_id){
          user_id = decoded.user_id;
        }else if(decoded.users_id){
          user_id = decoded.users_id;
        }
        console.log(decoded);
        
        user.aggregate([
          {
              $match : {_id : mongoose.Types.ObjectId(user_id) }
          },
          { $lookup :
              {
                  from: 'teacherdetails',
                  localField: '_id',
                  foreignField: 'teacher_id',
                  as: 'teacherdetails'
              }
          }
        ]).then((user)=>{
          console.log(JSON.stringify(user[0].teacherdetails));
          return res.json({success : true , message : "User Deatils" , data : user[0]});       
        }).catch((error)=>{
            return res.json({success : false , message : "Invalid User Id" , data : error});
        });
      }else{
        return res.json({success : false , message : "Something went wrong" , data : []});
      }
    }
  });
});

exports.teacherList = ((req,res)=>{
    token = req.headers['x-access-token'];  
    jwt.verify(token, process.env.TOKEN_KEY, function(err, decoded) {      
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
          if(decoded.user_id != ""){
            user.aggregate([
                {
                    $match : {user_type : "teacher" 
                }
                },
                { $lookup :
                    {
                        from: 'teacherdetails',
                        localField: '_id',
                        foreignField: 'teacher_id',
                        as: 'teacherdetails'
                    }
                },
                // {
                //     $unwind: "$teacherdetails"
                // }
                
            ]).then((user)=>{
                return res.json({success : true , message : "Teachers Deatils" , data : user});
            }).catch((error)=>{
                return res.json({success : false , message : "Records not found" , data : []});
            });
          }else{
            return res.json({success : false , message : "Something went wrong!!" , data : []});
          }
        }
      });
      
})

exports.statusUpdate = ((req,res)=>{
    id = req.params.id; state = req.params.status;
    user.findByIdAndUpdate({ _id : id }, { $set : { acc_verify : state}}).then((user)=>{
        if(state == 1){
            emails.sendEmail({from : "testing0706mail@gmail.com" , to : user.email.toLowerCase() , subject : "Test Email" , html : "<p>Hey, <br><br> Your Account is approved by admin , Please login to use Yogifi Portal</p>"});
            return res.json({success : true , message : "Teacher Approved Successfully!!" , data : user});
        }else if(state == 2){
            return res.json({success : false , message : "Teacher Declined Successfully!!" , data : user});
        }
    }).catch((error)=>{
        return res.json({success : false , message : "Invalid Id" , data : error});
    });
})

exports.changePassword = ((req,res)=>{
  if(req.body.password != "" && req.body.confirm_password != "" && req.body._id != ""){
    if(req.body.new_password === req.body.confirm_password){
      user.findById(req.body._id).then((users)=>{
        if(users == null){
          return res.json({ success : false, message : "User not found", data : error });
        }else{
          bcrypt.compare(req.body.password, users.password).then((responce) => {
						if(responce){
              password = bcrypt.hashSync(req.body.new_password, 10);
              user.findByIdAndUpdate(req.body._id,{password:password}).then((user)=>{
                return res.json({success : true , message : "Password Updated Successfully , Login to continue!!" , data : user});
              }).catch((error)=>{
                return res.json({ success : false, message : "Something went wrong!", data : error });
              });
						}else{
							return res.json({ success : false, message : "Invalid Password", data : [] });
						}
					}).catch((error) => {
						return res.json({ success : false, message : "Invalid Password", data : [] });
					});
        }
      }).catch((error) => {
        return res.json({ success : false, message : "Something Went Wrong", data : error });
      });
    }else{
      return res.json({ success : false, message : "Password and Confirm Password should be same", data : [] });
    }
  }else{
    return res.json({ success : false, message : "All fields are mandatory!", data : [] });
  }
})

exports.userDetails = ((req,res)=>{
  token = req.headers['x-access-token'];
    console.log(token);
    user.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then((userinfo)=>{
      if(userinfo){
        user.aggregate([
          {
              $match : {_id : mongoose.Types.ObjectId(userinfo._id) }
          },
          { $lookup :
              {
                  from: 'teacherdetails',
                  localField: '_id',
                  foreignField: 'teacher_id',
                  as: 'teacherdetails'
              }
          },
          { $lookup :
            {
                from: 'teacheruploads',
                localField: '_id',
                foreignField: 'teacher_id',
                as: 'uploads'
            }
          }
        ]).then((user)=>{
          console.log(JSON.stringify(user[0].teacherdetails));
          return res.json({success : true , message : "User Deatils" , data : user[0]});       
        }).catch((error)=>{
            return res.json({success : false , message : "Invalid User Id" , data : error});
        });
      }else{
        return res.json({success : false , message : "Invalid User Id" , data : error});
      }
    }).catch((err)=>{
      return res.json({success : false , message : "Failed to authenticate token." , data : err});
    });
})

exports.uploadContent = ((req,res)=>{
  user.findOne({ _id: mongoose.Types.ObjectId(req.body.teacher_id) }).then((userinfo)=>{
    if(userinfo){
      uploads.create(req.body).then((responce)=>{
        return res.json({success : true , message : "Content uploaded successfully" , data : responce});
      }).catch((err)=>{
        return res.json({success : false , message : "Something went wrong" , data : err});
      })
    }else{
      return res.json({success : false , message : "Invalid User Id" , data : []});
    }
  }).catch((err)=>{
    return res.json({success : false , message : "Failed to authenticate token." , data : err});
  });
});

module.exports = exports;