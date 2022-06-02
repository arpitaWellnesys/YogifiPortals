var mongo = require('mongoose');
var db = mongo.connect("mongodb://admin:YogiF!CES2020@34.68.255.171/YogiFi_CES?authSource=admin",function(err){
    console.log("Database Connected Successfully!!");
});