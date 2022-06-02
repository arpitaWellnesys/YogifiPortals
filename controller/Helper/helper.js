var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'testing0706mail@gmail.com',
    pass: 'test@0706'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// var username = "testing0706mail@gmail.com"
// var password = "test@0706"

var mailOptions = {
    from: 'youremail@gmail.com',
    to: 'myfriend@yahoo.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};

exports.sendEmail = ((mailOptions) => {
  console.log("mail option"+mailOptions.from , mailOptions.to)
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log(error);
      } else {
          console.log('Email sent: ' + info.response);
      }
  });
})

module.exports = exports;




  