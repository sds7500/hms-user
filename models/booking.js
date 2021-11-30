/*This model is responsible for storing booking related information which includes 
    1- Who booked the hotel (USER ID)
    2- Which hotel is booked (Hotel ID)
    3- When is booking done (Booked ON)
    4- For what dates booking is done ( Booked From - Booked Till )
    5- How many rooms are booked and of what type ( Number of Rooms and Type of Room )
*/
const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const bookingSchema=new Schema({
    user:{type: Schema.Types.ObjectId, ref: "user"},
    hotel:{type: Schema.Types.ObjectId, ref: "hotels"},
    bookedOn:{type: Date,default: Date.now()},
    bookedFrom:{type: Date,required:true},
    bookedTill:{type: Date,required:true},
    noOfRooms:{type: Number},
    roomType:String
})


module.exports=mongoose.model('booking',bookingSchema);