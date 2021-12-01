//packages required
const express=require('express');
const router=express.Router();

//middlewares required to authenticate user and for validation of data
const passportJWT=require('../middlewares/auth')();
const {isEmail,hasPassword,hasUserName,hasAfter,hasTill,hasNo}=require('../middlewares/validations/validators')

//controller to handle routes
const userController=require('../controllers/userController');

//routes to handle users request

// to get the list of users
router.get('/',userController.users);

//to get the list of booking
router.get('/booking',userController.bookings);

// login: to login registered user
router.post('/login',userController.login);

//signup: to add a new user
router.post('/signup',[isEmail,hasUserName,hasPassword],userController.signup);

//me: to get the details of active user with help of JWT Tokens
router.post('/me',passportJWT.authenticate(),userController.me)

//delete: to delete the user if he wants to
router.delete('/delete',passportJWT.authenticate(),userController.delete)

//search: to search for the hotel according to the location ( has following optional query parameters: city,state,pincode )
router.post('/search',userController.search)

//book: to book a hotel ( Hotel Id and Room Type are passed as parameters )
router.post('/book/:hotelId/:type',passportJWT.authenticate(),[hasAfter,hasNo,hasTill],userController.book)

//cancel: to cancel the booking ( booking id is passed as parameters )
router.post('/cancel/:id',passportJWT.authenticate(),userController.cancel)


module.exports=router;