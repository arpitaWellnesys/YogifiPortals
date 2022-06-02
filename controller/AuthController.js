require('dotenv').config();
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
var user = require("../model/Users");
var emails = require("../controller/Helper/helper");
var app_url = "http://localhost:4200/";
var mongoose = require('mongoose');

exports.login = ((req,res)=>{
    data = req.body;
    console.log(data);
    if(data.email != "" && data.password != ""){
        user.findOne({email : data.email}).then((users) => {
			if(users == null){
				return res.json({ success : false, message : "Email Address Not Found", data : [] });
			} else {
				if(users.is_verified == 1){
					bcrypt.compare(req.body.password, users.password).then((responce) => {
						if(responce){
							const token = jwt.sign(
								{ users_id: users._id, email : users.email },
								process.env.TOKEN_KEY
							);
							const data = {access_token : token ,users};
							user.updateOne({_id : mongoose.Types.ObjectId(users._id)}, {$set:{tokens:[{ token : token , access : 'auth'}]}}, {new: true}).then((users)=>{
								console.log(users);
								return res.json({ success : true, message : "Login successfully", data : data });
							}).catch((error)=>{
								return res.json({ success : false, message : "Something went wrong!", data : error });
							})
						}else{
							return res.json({ success : false, message : "Invalid Password", data : [] });
						}
					}).catch((error) => {
						return res.json({ success : false, message : "Invalid Password", data : [] });
					});
				} else {
					return res.json({ success : false , message : "Email Address is not verified, Check Your Mail for verification link or contact support team!!", data : user });
				}
			}
		}).catch((error) => {
			return res.json({ success : false, message : "Email and Password Mismatch!!", data : error });
		});
    }else{
        return res.json({success : false , message : "All Fields are required!!" , data : []});
    }
});

exports.register = ((req,res)=>{
    data = req.body;
    console.log(data);
    if(req.body.email != "" && req.body.password != ""){
		const {first_name , last_name , email, mobile_no , password} = req.body;
		user.findOne({email : req.body.email ,user_type : { $in: ['admin','teacher'] }}).then((users)=>{
            // console.log(users);
			if(users == null){
				otp = Math.floor(Math.random() * 899999 + 100000);
				console.log(otp);
                encryptedPassword = bcrypt.hashSync(password, 10);
				console.log(encryptedPassword);
				user.create({
					first_name : first_name,
					last_name : last_name,
					mobile_no : mobile_no,
					email : email.toLowerCase(),
					password : encryptedPassword,
					user_type : 'teacher',
					fcm_token : null,
					is_deleted : 0,
					is_verified : 0,
					profile_status : 0,
					email_code : otp,
					otp_time : new Date(),
					acc_verify : 0
				}).then( (user)=>{
					console.log(user);
					emails.sendEmail({from : "testing0706mail@gmail.com" , to : 'chiefyogi@yogifi.io' , subject : "Test Email" , html : "<p>A new teacher onboarded on Our Yogifi Portal , review there details by logging in with admin.</p>"});
					emails.sendEmail({from : "testing0706mail@gmail.com" , to : email.toLowerCase() , subject : "Test Email" , text : "This is your otp"+otp});
				    return res.json({ success : true , message : "Registered Successfully , Otp had been sent to your email address!!", data : user });
					// return res.json({ success : true, message : "User registered successfully", data : data });
				}).catch((error) => {
					return res.json({ success : false, message : "Something went wrong!", data : error });
				});
			}else{
				return res.json({ success : false, message : "Email Already exist", data : [] });
			}
		}).catch((error) => {
			return res.json({ success : false, message : "Email and Password Mismatch!!", data : error });
		});
	} else{
		return res.json({ success : false, message : "All fields are mandatory!", data : [] });
	}
    // return res.json({success : true , message : "Register Successfully" , data : req.body});
});

exports.forgetPassword = ((req,res)=>{
	console.log("REQUEST BODY"+req.body);	
	if(req.body.email != "" ){
		user.findOne({email : req.body.email}).then((users)=>{
            if(users == null){
				return res.json({ success : false, message : "Email Not exist", data : [] });
			}else{
				link = app_url+"reset-password/"+users._id;
				console.log(link);
				emails.sendEmail({from : "testing0706mail@gmail.com" , to : users.email, subject : "Test Email" , text : "Click Here to reset your password, "+link});
				return res.json({success : true , message : "Check your email for reset password link" , data : []});
			}
		}).catch((error) => {
			return res.json({ success : false, message : "Email and Password Mismatch!!", data : error });
		});
	}else{
		return res.json({ success : false, message : "All fields are mandatory!", data : [] });
	}
});

exports.verifyOtp = ((req,res)=>{
	console.log("REQUEST BODY"+req.body);
	if(req.body._id != "" && req.body.otp != ""){
		user.findById(req.body._id).then((users)=>{
			console.log("USER DETAILS "+users);
			if(users == null){
				return res.json({ success : false, message : "Invalid Verification Link", data : error });
			}else{
				if(users.is_verified == 1){
					return res.json({ success : true, message : "Already Verified , Please login to continue!!", data : [] });
				}
				if(users.email_code != req.body.otp){
					return res.json({ success : false, message : "Wrong Verification Code", data : [] });
				}else{
					user.findByIdAndUpdate(req.body._id,{is_verified:1}).then((user)=>{
						return res.json({success : true , message : "Verified Successfully, Please Login to continue!!" , data : req.body});
					}).catch((error)=>{
						return res.json({ success : false, message : "Something went wrong!", data : error });
					})
				}
			}
		}).catch((error) => {
			return res.json({ success : false, message : "Something Went Wrong", data : error });
		});
	}else{
		return res.json({ success : false, message : "All fields are mandatory!", data : [] });
	}
})

exports.resendOtp = ((req,res)=>{
	console.log("REQUEST BODY"+JSON.stringify(req.body));
	user.findById(req.body._id).then((users)=>{
		console.log("USER DETAILS "+users);
		if(users == null){
			return res.json({ success : false, message : "User not found", data : error });
		}else{
			if(users.is_verified == 1){
				return res.json({ success : true, message : "Already Verified , Please login to continue!!", data : [] });
			}else{
				otp = Math.floor(Math.random() * 899999 + 100000);
				console.log(otp);
				
				user.findByIdAndUpdate(req.body._id,{email_code:otp}).then((user)=>{
					emails.sendEmail({from : "testing0706mail@gmail.com" , to : user.email, subject : "Test Email" , text : "This is your otp "+otp});
					return res.json({success : true , message : "Otp send successfully on linked email address" , data : user});
				}).catch((error)=>{
					return res.json({ success : false, message : "Something went wrong!", data : error });
				})
			}
		}
	}).catch((error) => {
		return res.json({ success : false, message : "Something Went Wrong", data : error });
	});
});

exports.googleLogin = ((req,res)=>{
	if(req.body.email != ""){
		user.findOne({email : req.body.email ,user_type : { $in: ['admin','teacher'] }}).then((users)=>{
			if(users == null){
				user.create({
					email : req.body.email,
					user_type : 'teacher',
					fcm_token : null,
					is_deleted : 0,
					is_verified : 1,
					profile_status : 0,
					googlefacebook_id : req.body.id,
					acc_verify : 0
				}).then((users)=>{
					const token = jwt.sign(
						{ user_id: users._id, email : users.email },
						process.env.TOKEN_KEY
					);
					const data = {access_token : token ,users};
					user.updateOne({_id : mongoose.Types.ObjectId(users._id)}, {$set:{tokens:[{ token : token , access : 'auth'}]}}, {new: true}).then((users)=>{
						console.log(users);
						return res.json({ success : true, message : "Login successfully", data : data });
					}).catch((error)=>{
						return res.json({ success : false, message : "Something went wrong!", data : error });
					})
				}).catch((error) => {
					return res.json({ success : false, message : "Something went wrong!", data : error });
				});
			}else{
				console.log(users);
				if(users.googlefacebook_id){
					console.log("HERE");
					const token = jwt.sign(
						{ user_id: users._id, email : users.email },
						process.env.TOKEN_KEY
					);
					const data = {access_token : token ,users};
					return res.json({ success : true, message : "Login successfully", data : data });
				}else{
					console.log("HERE2")
					return res.json({ success : false, message : "Email already exist, please login with password!!", data : [] });
				}
			}
		}).catch((error) => {
			return res.json({ success : false, message : "Email and Password Mismatch!!", data : error });
		});
	}else{
		return res.json({ success : false, message : "All fields are mandatory!", data : [] });
	}
});

exports.resetPassword = ((req,res)=>{
	if(req.body.password != "" && req.body.confirm_password != "" && req.body._id != ""){
		if(req.body.password === req.body.confirm_password){
			user.findById(req.body._id).then((users)=>{
				if(users == null){
					return res.json({ success : false, message : "User not found", data : error });
				}else{
					password = bcrypt.hashSync(req.body.password, 10);
					user.findByIdAndUpdate(req.body._id,{password:password}).then((user)=>{
						return res.json({success : true , message : "Password Updated Successfully, Please login again!" , data : user});
					}).catch((error)=>{
						return res.json({ success : false, message : "Something went wrong!", data : error });
					})
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
});


module.exports = exports;

