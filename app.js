 const express = require('express');
 const app = express();
 
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
 app.use(express.json()); //middleware
 app.use('/api/v1/tours', tourRouter)
 app.use('/api/v1/users', userRouter)


 app.use((req,res)=>{
    console.log('sorry page not found 🙏🙏')
    res.status(404).json({
        status:"failed",
        message:"Sorry page not found 🤣😊😊😂🤣"
    })
 })

 app.use((error,req,res,next)=>{
    console.log('Error middleware called 🌋🌋🌋🌋🌋🌋')
    
    next();



 })
 module.exports = app
 
 

