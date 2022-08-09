const express= require('express');
const router =express.Router();
const bcrypt = require('bcrypt');
const userCredential =require('../models/userCredentials');

router.post('/register',(req,res)=>{
    const {userId,password} = req.body;
    if(!userId){
        res.status(400).send({error:"userId not provided"});
        return;
    }
    if(!password){
        res.status(400).send({error:"Password not provided"});
        return;
    }
    userCredential.findOne({userId}).then(user=>{
        if(user){
            res.status(400).send({error:"User already Signed up"});
            return;
        }
        const hash=bcrypt.hashSync(password,8);
        var expiryDate = new Date();
        console.log(expiryDate)
        expiryDate.setDate(expiryDate.getDate() + 30);
        console.log(expiryDate);
        const UserCredential=new userCredential({ userId, password: hash,expiryDate});
        UserCredential.save().then(()=>{
            res.status(201).send("User was created succesfully");
        });
    }).catch(() => {
        res.status(500).send({ error: "Internal Server Error" });
    });
});

router.post('/login',(req,res)=>{
    if (!req.body) {
        res.status(400).send({error: "userId and Password not present in request"});
        return;
    }
    const { userId, password } = req.body;
    if (!userId) {
        res.status(400).send({error: "userId not present in request"});
        return;
    }
    if (!password) {
        res.status(400).send({error: "Password not present in request"});
        return;
    }
    userCredential.findOne({ userId }).then(user => {
        if (!user) {
            res.status(400).send({error: "User not registered"});
            return;
        }
        if(Date.now()==user.expiryDate){
            res.status(400).send({error: "Password Expired"});
            return;
        }
        const match = bcrypt.compareSync(password, user.password);

        if (!match) {
            res.status(400).send({error: "Incorrect userId or password"});
            return;
        }
        res.status(204).send("Logged in Successfully");
    }).catch(() => {
        res.status(500).send({ error: "Internal Server Error" });
    });
});


module.exports=router;