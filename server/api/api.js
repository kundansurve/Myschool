const express = require('express');
const router = express.Router();

const users = require('./user');
const students = require('./student');
const classes = require('./classes');

router.use(express.json());

router.use(express.urlencoded({ extended: true }));

router.get('/',(req,res)=>{
    res.status(200).send("Welcome to Myschool Backend API service");
    return;
})

router.use('/user', users);

router.use('/students', students);

router.use('/classes',classes);

module.exports = router;