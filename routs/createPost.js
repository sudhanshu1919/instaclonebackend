const express =require("express")
const mongoose = require("mongoose");
const router = express.Router()
const requirelogin = require("../middelware/requirelogin");
const { route } = require("./auth");
const POST = mongoose.model("POST")



// Route
// show all data from databse on the instaclone 
router.get("/allposts",requirelogin,(req,res)=>{

    POST.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>res.json(posts))
    .catch(err => console.log(err))

})

router.post("/createPost",requirelogin,(req,res)=>{
    const {body , pic }=req.body
    console.log(pic)
    if(!body || !pic){
        return res.status(422).json({error:"Please add all the fieldes..!"})
    }
   
    console.log(req.user)
    const post = new POST ({
      
        body,
        photo:pic,
        postedBy: req.user
    })
    post.save().then((result)=>{
        return res.json({post:result})
    }).catch(err=>console.log(err))
   

})

router.get("/myposts",requirelogin,(req,res)=>{
   POST.find({postedBy:req.user._id})
   .populate("postedBy","_id name")
   .then(myposts=>{
    res.json(myposts)
   })
})



router.put("/like",requirelogin,(req,res)=>{
    POST.findByIdAndUpdate(req.body.postId,{
        $push:{ likes:req.user._id } 
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


router.put("/unlike",requirelogin,(req,res)=>{
    POST.findByIdAndUpdate(req.body.postId,{
        $pull:{ likes:req.user._id }
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})





router.put("/comment",requirelogin,(req,res)=>{
    const comment ={
        comment:req.body.text,
        postedBy:req.user._id
    }
    POST.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .then((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

// to uploade profile pick
router.put("/uploadProfilePic",requirelogin,(req,res)=>{
    USER.findByIdAndUpdate(req.user._id,{
        $set:{Photo:req.body.pic}
    },{
        new:true
    }).then((err,result)=>{
        if(err){
           return res.status(422).json({error:err})
        }else{
            return res.json(result)
        }

    })
})





module.exports = router