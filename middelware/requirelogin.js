const jwt = require("jsonwebtoken")
const { Jwt_secret } =require("../Keys")
const mongoose = require("mongoose")

const USER  = mongoose.model("USER")



module.exports=(req,res,next)=>{
    const { auhorization } = req.headers;
    if(!auhorization){
        return res.status(401).json({
            error:"You must have logged in -> 1"
        })
    }
        const token = auhorization.replace("Bearer","")
        jwt.verify(token,Jwt_secret,(err,payload)=>{
            if(err){
                return res.status(401).json({
                    error:"You must have logged in -> 2 "
                })
            }
            const {_id}= payload
              USER.findById(_id).then(userData =>{
                // console.log(userData)
                // req.user = userData
                req.user = userData
                next()
            })
        })
       
   
   
}