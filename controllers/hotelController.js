const validationHandler=require("../middlewares/validations/validationHandler");
const Hotel=require("../models/hotels")

// 1: INDEX=> returns the list of hotel from database
exports.index=async(req,res,next)=>{
    try{
        let hotel=await Hotel.find();
        res.send(hotel);
    }catch(err){
        next(err);
    }
}

// 2: SAVE=> Stores the Information of new Hotel after validating the details in database.
exports.save=async(req,res,next)=>{
    try{
        validationHandler(req);
        let hotel=new Hotel();
        hotel.name=req.body.name;
        hotel.address=req.body.address;
        hotel.type=req.body.type;
        hotel.aminities=req.body.aminities;
        hotel.rating=req.body.rating;
        for(let t of hotel.type)
            t.availableRoom=Array(8).fill(t.totalRoom);
        hotel=await hotel.save();
        res.status(201).send({"message":"Hotel added Successfully"})
    }catch(err){
        next(err);
    }
}

// 3: SHOW => to find the hotel according to the provided ID paramter 
exports.show=async(req,res,next)=>{
    try{
        let hotel=await Hotel.findOne({_id:req.params.id});
        res.send(hotel);
    }catch(err){
        next(err);
    }
}

// 4: DELETE => to delete the hotel according to the provided ID parameter
exports.delete=async(req,res,next)=>{
    try{
        let hotel=await Hotel.findById(req.params.id);
        await hotel.delete();
        res.send({"message":"Deleted Successfully"})
    }catch(err){
        next(err);
    }
}

/* This is a asynchronous function responsible for
    updating room availibility every 24 hours to remove information 
    of finsished day and add info of 8th day from now*/
async function updateRoom(){
    let hotel=await Hotel.find();
    for(let h of hotel){
        for(let t of h.type){
            for(let i=0;i<7;i++){
                t.availableRoom[i]=t.availableRoom[i+1];
                t.bookedRoom[i]=t.bookedRoom[i+1];
            }
            t.availableRoom[7]=t.totalRoom;
            t.bookedRoom[7]=0;
        }
        await h.save();
    }
}

setInterval(updateRoom,86400000);