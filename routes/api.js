var express = require ('express');
var router = express.Router();
var middleware = require("../middleware/auth");

var ProfileController = require("../controller/ProfileController");
var AuthController = require("../controller/AuthController");
var UserController = require("../controller/UserController");
var FamilarityController = require("../controller/FamilarityController");
var TimesheetController = require("../controller/TimesheetController");

router.get('/familarities',FamilarityController.list);
router.post('/login',AuthController.login);
router.post('/register',AuthController.register);
router.post('/forget-password',AuthController.forgetPassword);
router.post('/verify-otp',AuthController.verifyOtp);
router.post('/resend-otp',AuthController.resendOtp);
router.post('/google-login',AuthController.googleLogin);
router.post('/reset-password',AuthController.resetPassword);

// After Login Routes 
router.get('/teacher-status/:id/:status',middleware.checkToken,UserController.statusUpdate);
router.get('/user-details',  UserController.details);
router.get('/teacher-list', UserController.teacherList);
router.post('/profile',middleware.checkToken, ProfileController.profile);
router.get('/timesheet/:id',middleware.checkToken, TimesheetController.show);
router.post('/add-timesheet',middleware.checkToken, TimesheetController.addTimesheet);
router.post('/change-password', middleware.checkToken , UserController.changePassword);
router.get('/profile-details/:id', middleware.checkToken , ProfileController.profileDetails);
router.get('/user-details-by-id/:id', middleware.checkToken , UserController.userDetails);
router.post('/upload-content',middleware.checkToken,UserController.uploadContent);

module.exports = router;
