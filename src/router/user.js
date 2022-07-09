const express=require('express')
const User=require('../models/user')
const router=new express.Router()

router.post('/users',async (req,res)=>{
    const user=new User(req.body)

    try{
        await user.save()
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }

})

router.post('/users/login',async (req,res)=>{
    try{
       const user=await User.findByCredentials(req.body.email,req.body.password) 
       res.send(user)
    }catch(e){
        res.status(400).send()

    }
})


router.get('/users',async (req,res)=>{

    try{
        const users =await User.find({})
        res.send(users)
    } catch(e){
        res.status(500).send()
    }
    
})


router.get('/users/:id',async (req,res)=>{
    const _id= req.params.id
    
    try{
        const user=await User.findById(_id)
        if(!user){
            return res.status(400).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
 
})

router.patch('/users/:id',async(req,res)=>{
    //line 54 to 60 is to check whether keys other than given are being updated
    const updates=Object.keys(req.body) //return array
    const allowedUpdates=['name','age','email','password']
    const isValidUpdate=updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidUpdate){
        return res.status(400).send({error:"invalid updates"})
    }
    try{
        const user=await User.findById(req.params.id)
        updates.forEach((update)=>user[update]=req.body[update])
        await user.save()

        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){

        res.status(400).send(e)

    }
})

router.delete('/users/:id',async(req,res)=>{
  try{
    const user= await User.findByIdAndDelete(req.params.id)
    if(!user){
        return res.status(404).send()
    }
    res.send(user)
  }catch(e){
    res.status(500).send(e)
  }
})

module.exports=router



