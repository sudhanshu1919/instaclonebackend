
const express =require("express")
const mongoose = require("mongoose");
require('../moduls/moduls')
const router = express.Router()
const USER = mongoose.model("USER")
const bcrypt = require('bcrypt')
const jwt =require("jsonwebtoken")
const {Jwt_secret} = require("../Keys");
const requirelogin = require("../middelware/requirelogin");


router.get('/',(req,res)=>{
    res.send("It is Instagram ")
})




// This is endpoint use for signup functionalyty
router.post("/signup",(req,res)=>{
     
  
    // console.log(req.body.name)
    
    // this is endpoint for complsary field
    const {name,userName,email,password} = req.body;
    // If you have miss any field then condition will be run
    if(!name || !email || !userName || !password){
        return res.status(422).json({error:"Plase add all the fields"})
     }else{
         res.json({massage:"User registered succesfully..!"})
     }

     //  Any user con not fill smae information in the database..!
    USER.findOne({$or:[{email:email},{userName:userName}]}).then((saveUser)=>{
        if(saveUser){
            return res.status(422).json({error:"User allredy exist with taht email or userName ..!"})
        }
        bcrypt.hash(password,12).then((heashPassword)=>{
            const user = new USER({
                name,
                email,
                userName, 
                password:heashPassword
            })
            user.save()
            .then(user =>{ res.json({massage:" User allredy exist with taht email or userName   "})}) //Reegistered  successfully
            .catch(err =>{console.log(err)})
        })
      
    })

    

  



    


       
       
    
       
       
    
    
})


// This is endpoint create for signin functionality



router.post('/signin', (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(422).json({ error: "Please add email and password..!" });
    }
  
    // Find the user in the database based on the email
    USER.findOne({ email: email }).then((saveUser) => {
      if (!saveUser) {
        return res.status(422).json({ error: "Invalid email" });
      }
  
      // Compare the password with the hashed password in the database
      bcrypt.compare(password, saveUser.password).then((match) => {
        if (match) {
          // return res.status(200).json({ message: "Sign in successfully" });
         
         
          // We have use jwt athatication when user signin 
          const token = jwt.sign({_id:saveUser.id},Jwt_secret)
          
          const {_id,name,email,userName}= saveUser
          res.json({token,user:{_id,name,email,userName}})
       

          // console.log({token,user:{_id,name,email,userName}})

        } else {
          return res.status(422).json({ error: "Invalid password" });
        }
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  });
  







module.exports = router;