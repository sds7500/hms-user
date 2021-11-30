//required packages
const express=require('express');
const router=express.Router();

//controller to handle routes
const hotelController=require('../controllers/hotelController');

//middleware to handle validtion of data
const {hasCity,hasPinCode,hasState,hasType}=require('../middlewares/validations/validators')

//routes to handle CRUD operations of hotel

//1: to fetch the entire list of hotels
router.get('/',hotelController.index)

//2: to add new hotel
router.post('/',[hasCity,hasPinCode,hasState,hasType],hotelController.save)

//3: to get a particular hotel ( Hotel Id passed as paramter )
router.get('/:id',hotelController.show)

//4: to delete a particular hotel ( Hotel Id passed as paramter )
router.delete('/:id',hotelController.delete)

module.exports=router;