var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var multer =  require('multer');
var upload = multer();
var morgan = require('morgan');
var methodOverride = require('method-override');
var mongo = require('./db/connection');
var router = require('./routes/api');
const path = require('path');
  
//use middleware and set headers

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-type,Accept,x-access-token');
    res.header('Access-Control-Allow-Methods','OPTIONS,GET,POST,PUT,DELETE');
    if('OPTIONS'==req.method){
      res.sendStatus(200);
    }
    else{
      console.log('${req.ip} ${req.method} ${req.url}');
      next();
    }
})


app.use(bodyparser.json({limit: '1000mb',extended: true}));
app.use(bodyparser.urlencoded({limit: '1000mb', extended: true}));

// override with different headers; last one takes precedence
app.use(methodOverride('X-HTTP-Method'))          // Microsoft
app.use(methodOverride('X-HTTP-Method-Override')) // Google/GData
app.use(methodOverride('X-Method-Override'))      // IBM

app.use(morgan('dev'));

app.use('/',router);
const _port = 8081;

const _app_folder = 'dist/teachingPortal';

// ---- SERVE STATIC FILES ---- //
app.get('*.*', express.static(_app_folder, {maxAge: '1y'}));

// ---- SERVE APLICATION PATHS ---- //
app.all('*', function (req, res) {
    res.status(200).sendFile(`/`, {root: _app_folder});
});
app.listen(_port, function () {
    console.log("Node Express server for " + app.name + " listening on http://localhost:" + _port);
});