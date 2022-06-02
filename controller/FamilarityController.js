var familiarities = require("../model/Familarity");

exports.list = ((req,res)=>{
    familiarities.find({}).then((list)=>{
        if(list){
            return res.json({ success: true, message: 'Familarities list', data : list });    
        }else{
            return res.json({ success: false, message: 'Familarities not available' });    
        }
    }).catch((error)=>{
        return res.json({ success: false, message: 'Something Went Wrong' , data : error });    
    })
})

module.exports = exports;