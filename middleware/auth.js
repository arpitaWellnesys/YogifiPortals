require('dotenv').config();
var jwt = require("jsonwebtoken");
const user = require('../model/Users');

let checkToken = (req, res, next) => {
  (async () => {
    var token = req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, process.env.TOKEN_KEY, function(err, decoded) {      
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
          if(decoded.user_id != ""){
            next();
          }else{
            return res.json({success : false , message : "Something went wrong!!" , data : []});
          }
        }
      })
      }
    })();
};

module.exports = {
  checkToken: checkToken
};