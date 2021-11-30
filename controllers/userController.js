const validationHandler=require("../middlewares/validations/validationHandler");
const jwt=require('jwt-simple');
const config=require('../config');
const User = require("../models/user");
const Hotel=require("../models/hotels")
const Booking=require('../models/booking');

//1: LOGIN => validates user details and logs in if the user is correct
exports.login=async(req,res,next)=>{
    try{
        
        let email=req.body.email;
        let password=req.body.password;
        let user=await User.findOne({email});
        if(!user){
            const error=new Error("Wrong Email ID");
            error.statusCode=403;
            throw error;
        }
        const validPassword=await user.validPassword(password);
        if(!validPassword){
            const error=new Error("Wrong Password");
            error.statusCode=403;
            throw error;
        }
        const token=jwt.encode({id:user.id},config.JWTsecretKey);
        return res.send({"Token":token,"message":"Login was Successful"})
    }catch(err){
        next(err);
    }
}

//2: SIGNUP=> adding new User to the Collection
exports.signup=async(req,res,next)=>{
    try{
        validationHandler(req);
        let name=req.body.name;
        let email=req.body.email;
        let password=req.body.password;
        const validuser=await User.findOne({email});
        if(validuser){
            const error=new Error("Email Already in Use");
            error.statusCode=403;
            throw error;
        }
        let user=new User();
        user.email=email;
        user.password=await user.encryptPassword(password);
        user.name=name;
        await user.save()
        const token=jwt.encode({id:user.id},config.JWTsecretKey);
        return res.send({"Token":token,"message":"Registration Successful"});
    }catch(err){
        next(err);
    }
}

//3: ME=> to get the details of active user
exports.me = async (req, res, next) => {
    try {
      let user = await User.findById(req.user);
      return res.send(user);
    } catch (err) {
      next(err);
    }
};

//4:DELETE=> to delete the logged in user if he wants 
exports.delete=async(req,res,next)=>{
    try{
        let user=await User.findById(req.user);
        await user.delete();
        res.send({"message":"Deleted User Successfully"})
    }catch(err){
        next(err);
    }
}

//5:SEARCH=> to search for the hotel based on the location ( city, state and pincode )
exports.search=async(req,res,next)=>{
    try{
        let city=req.query.city?req.query.city:false;
        let state=req.query.state?req.query.state:false;
        let pincode=req.query.pincode?req.query.pincode:false;
        let hotel;
        if(state && city && pincode){
            hotel=await Hotel.find({"address.city":city, "address.state":state, "address.pincode":pincode });
        }else if(state && city){
            hotel=await Hotel.find({"address.city":city, "address.state":state });
        }else if(state && pincode){
            hotel=await Hotel.find({ "address.state":state, "address.pincode":pincode });
        }else if(city && pincode){
            hotel=await Hotel.find({"address.city":city, "address.pincode":pincode });
        }else if(city){
            hotel=await Hotel.find({"address.city":city });
        }else if(state){
            hotel=await Hotel.find({"address.state":state});
        }else if(pincode){
            hotel=await Hotel.find({ "address.pincode":pincode });
        }else{
            hotel=await Hotel.find();
        }
        if(hotel.length==0)res.send({"message":"No hotel in requested area"});
        res.send(hotel);
    }catch(err){
        next(err);
    }
}

//6:BOOK => booking hotel based on the given dates and number of rooms if available
exports.book=async(req,res,next)=>{
    try{
        validationHandler(req);
        let hotel=await Hotel.findById(req.params.hotelId);
        const type=hotel.type;
        const roomType=req.params.type;
        for(const t of type){
            if(t.roomType==roomType){
                const after=req.body.after;
                const till=req.body.till;
                const number=req.body.number;
                if(after+till<9){
                    for(let i=after;i<after+till;i++){
                        if(t.availableRoom[i]<number){
                            res.send({"message":"Requested number of Rooms are Not available on requested date"})
                        }
                    }
                    let booking=new Booking();
                    booking.user=req.user;
                    booking.hotel=hotel;
                    booking.bookedOn=Date.now();
                    booking.bookedFrom=Date.now();
                    booking.bookedFrom.setDate(booking.bookedFrom.getDate() +after)
                    booking.bookedTill=Date.now();
                    booking.bookedTill.setDate(booking.bookedTill.getDate() +after+till-1)
                    booking.noOfRooms=number;
                    booking.roomType=roomType;
                    await booking.save();
                    for(let i=after;i<after+till;i++){
                        t.availableRoom[i]-=number;
                        t.bookedRoom[i]+=number;
                    }
                    await hotel.save();
                    res.send({"message":"Booking Successful"});
                }
                res.send({"message":"You can do booking for only next 8 days"})
            }
        }
    }catch(err){
        next(err);
    }
}

//7:CANCEL=> Cancelling booking and updating the same in Database
exports.cancel=async(req,res,next)=>{
    try{
        let user=await User.findById(req.user);
        const booking=await Booking.findById(req.params.id)
        if(user.id!=booking.user){
            let error=new Error("Requested cancellation is not from authorized user");
            error.statusCode=401;
            throw error;
        }
        const hotel=await Hotel.findById(booking.hotel);
        for(let t of hotel.type){
            if(t.roomType==booking.roomType){
                var d1=booking.bookedFrom.getDate();
                var d2=booking.bookedTill.getDate();
                const d=new Date().getDate();
                var m1=booking.bookedFrom.getMonth();
                var m2=booking.bookedTill.getMonth();
                const m=new Date().getMonth();
                if(m1>m){
                    if(m1==2)d1=d1+28;
                    else if((m1%2==0 && m1<=6) || (m1%2==1 && m1>6))d1=d1+30;
                    else d1=d1+31;
                }if(m2>m){
                    if(m2==2)d2=d2+28;
                    else if((m2%2==0 && m2<=6) || (m2%2==1 && m2>6))d2=d2+30;
                    else d2=d2+31;
                }
                var after=d1-d;
                var till=d2-d;
                for(let i=after;i<=till;i++){
                    t.availableRoom[i]+=booking.noOfRooms;
                    t.bookedRoom[i]-=booking.noOfRooms;
                }
                await hotel.save();
                await booking.delete();
                res.send({"message":"booking deleted successfully"});
            }
        }
    }catch(err){
       next(err);
    }
}