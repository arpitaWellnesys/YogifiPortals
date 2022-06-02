let express = require('express');
let app = express();

// For POST-Support
let bodyParser = require('body-parser');
let multer = require('multer');
const path = require('path')
let upload = multer();
app.use((request,response,next)=>{
   response.header('Access-Control-Allow-Origin','*');
   response.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-type,Accept');
   response.header('Access-Control-Allow-Methods','OPTIONS,GET,POST,PUT,DELETE');
   if('OPTIONS'==request.method){
   response.sendStatus(200);
   }
   else{
   //console.log('${req.ip} ${req.method} ${req.url}');
   next();
   }
   })
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// app.use(express.static(__dirname + '/dist'));
// app.get('/*', function(req,res) {
//    res.sendFile(path.join(__dirname + '/dist/Happily/index.html'));
// });



// app.listen(4200);

const _port = 4100;
const _app_folder = 'dist/teachingPortal';
//const app = express();

// ---- SERVE STATIC FILES ---- //
app.get('*.*', express.static(_app_folder, {maxAge: '1y'}));

// ---- SERVE APLICATION PATHS ---- //
app.all('*', function (req, res) {
    res.status(200).sendFile(`/`, {root: _app_folder});
});

// ---- START UP THE NODE SERVER  ----
app.listen(_port, function () {
    console.log("Node Express server for " + app.name + " listening on http://localhost:" + _port);
});