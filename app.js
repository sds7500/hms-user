// required packages
const express = require('express')
const cors = require('cors')
const bodyParser=require('body-parser')
const mongoose=require("mongoose")
const config=require('./config')

//required routes
const hotelRoutes=require('./routes/hotel')
const userRoutes=require('./routes/users')

//required middlewares
const errorHandler = require('./middlewares/errorHandler')
const passportJWT=require('./middlewares/auth')();

const app = express()

//database connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true
});

app.use(cors())
app.use(bodyParser.json())
app.use(passportJWT.initialize())

/*routing: 
1: api/hotels => uses hotelRoutes to handle request related to manipulation of hotels (CRUD Operation on hotels)
2: api/user => uses userRoutes to handle users request related to login signup searching booking and cancellation of hotel request
*/
app.use('/api/hotels',hotelRoutes);
app.use('/api/users',userRoutes);

app.use(errorHandler)

app.listen(config.port,()=>{
    console.log("listening");
})