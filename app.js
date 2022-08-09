var express = require('express');
var app = express();
const path = require('path');

const port = 3000;
const api = require('./server/api/api');
const db = require('./server/db');


db.connect()
.then(() => {
  //Handle /api with the api middleware
  app.use('/api', api);
  app.get('/',(req,res)=>{
    res.status(200).send("Welcome to Myschool platform");
    return;
})
  app.listen(3000, function () {
    console.log('MySchool Backend listening on port 3000!');
  });
});