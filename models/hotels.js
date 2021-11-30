/*This model is responsible for storing hotel related information which includes 
    1- The name of the hotel ( Name )
    2- Address of the hotel which includes area,city,state,pincode ( Address )
    3- Diffrent type of Rooms like delux,ac,normal etc having seprate information related to pricing and availibility ( Type )
    4- Aminities offered by the hotel and rating of the hotel ( Aminities and Rating )
*/

const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const hotelSchema=new Schema({
    name: {type:String, required:true},
    address:{
        area:String,
        city:String,
        state: String,
        pincode: Number
    },
    type:[{
        roomType:String,
        price:Number,
        totalRoom:Number,
        availableRoom:[Number],
        bookedRoom:{type:[Number],default:[0,0,0,0,0,0,0,0]}
    }],
    aminities:[String],
    rating:Number,
})


module.exports=mongoose.model('hotel',hotelSchema);