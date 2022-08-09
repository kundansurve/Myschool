const express= require('express');
const router =express.Router();
const bcrypt = require('bcrypt');
const userCredential =require('../models/userCredentials');

router.post('/register',(req,res)=>{
    const {username,password} = req.body;
    if(!username){
        res.status(400).send({error:"Username not provided"});
        return;
    }
    if(!password){
        res.status(400).send({error:"Password not provided"});
        return;
    }
    userCredential.findOne({username}).then(user=>{
        if(user){
            res.status(400).send({error:"User already Signed up"});
            return;
        }
        const hash=bcrypt.hashSync(password);
        const UserCredential=new userCredential({ username, password: hash});

        UserCredential.save().then(()=>{
            res.status(201).send("User was created succesfully");
        });
    }).catch(() => {
        res.status(500).send({ error: "Internal Server Error" });
    });
});

router.post('/login',(req,res)=>{
    if (!req.body) {
        res.status(400).send({error: "username and Password not present in request"});
        return;
    }
    const { username, password } = req.body;
    if (!username) {
        res.status(400).send({error: "Username not present in request"});
        return;
    }
    if (!password) {
        res.status(400).send({error: "Password not present in request"});
        return;
    }
    userCredential.findOne({ username }).then(user => {
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
            res.status(400).send({error: "Incorrect username or password"});
            return;
        }
        res.status(204).send("Logged in Successfully");
    }).catch(() => {
        res.status(500).send({ error: "Internal Server Error" });
    });
});


module.exports=router;