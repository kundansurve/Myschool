const express = require('express');
const router = express.Router();
const Classes = require('./../models/class');

router.get('/', (req, res) => {
    classes.find({})
        .then((Classes) => {
            res.status(400).send(Classes);
        }).catch(error => {
            res.status(500).send("server error: " + error);
        })
});

router.post('/add', (req, res) => {
    const data = req.body;
    const filteredData=[];
    let succesfull=undefined;
    for (let className in data) {
        let obj = { className, year: data[className].Year, classTeacher: data[className].Class_teacher, subjectLists: data[className].Subject_list, students:data[className].Students };
        if(!obj.className || !obj.year || !obj.classTeacher || !obj.subjectLists || !obj.students){
            continue;
        }
        if (obj.subjectLists.length== 0) {
            classWithNosubjects += 1;
        }
        const subjectObject = {};
        for (let subjectname of obj.subjectLists) {
            subjectObject[subjectname] = true;
        }
        if(Object.keys(subjectObject).length==0){
            continue;
        }
        const filteredStudentsData ={};
        for (let student in obj.students) {
            const filteredMarksData = {}
            let cnt=0;
            
            for (let sub of Object.keys(obj.students[student].Marks)) {
                if (!subjectObject[sub]) {
                    continue;
                }
                if(cnt===6)break;
                filteredMarksData[sub] = obj.students[student].Marks[sub];
                cnt=cnt+1;
            }
            if (Object.keys(filteredMarksData).length!= 0) {
                filteredStudentsData[student] = obj.students[student];
                filteredStudentsData[student].Marks=filteredMarksData;
            }
        }
        obj.students=filteredStudentsData;
        filteredData.push(obj);
    }
    let ptr=0;
    filteredData.forEach(classObj => {
        const classes = new Classes(classObj);
        classes.save();
        ptr++;
        if(ptr==filteredData.length){
            if(succesfull===false)return;
            succesfull=true;
            res.status(200).send("Classes added succesfully! if students marks data is greater than 0 automatically 1st 6 class validated subject marks are added and claases are also filtered subjectlist length should be>0");
            return;
        } 
    })
    setTimeout(()=>{
        if(succesfull===true || succesfull===false)return;
        succesfull=false;
        res.status(500).send("Server error api call timeout");
        return;
    },5000)
})


module.exports = router;