require('dotenv').config();
var jwt = require("jsonwebtoken");

const auth = jwt({
    secret: process.env.TOKEN_KEY,
    userProperty: 'payload'
});
    
module.exports = auth;
