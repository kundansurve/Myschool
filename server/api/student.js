const express = require('express');
const router = express.Router();
const Student = require('./../models/studentDetail');
const Classes = require('./../models/class');

router.get('/', (req, res) => {
    Student.find({})
        .then((students) => {
            res.status(200).send(students);
            return;
        }).catch(error => {
            res.status(500).send("Server error: " + error);
            return;
        });
});

router.get('/marks', (req, res) => {
    const { subjectName, className } = req.body;
    let succesfull = undefined;
    Classes.findOne({ className })
        .then(classDetails => {
            if (!classDetails) {
                succesfull = false;
                res.status(400).send("No such class is present");
                return;
            }
            const studentsData = classDetails.students;
            const resData = {};
            for (let studentRoll in studentsData) {
                if (studentsData[studentRoll].Marks[subjectName]) {
                    resData[studentsData[studentRoll].Student_id] = { subjectName: studentsData[studentRoll].Marks[subjectName], rollNumber: studentRoll };
                }
            }
            let cnt = 0;
            Object.keys(resData).forEach(element => {
                Student.findOne({ studentId: element }).then((studentDetail) => {
                    resData[element]['studentDetail'] = studentDetail;
                    if (!studentDetail) resData[element]['studentDetail'] = 'Not Registered';
                    cnt++;
                    if (cnt === Object.keys(resData).length) {
                        if (succesfull === false) return;
                        succesfull = true;
                        res.status(200).send(resData);
                        return;
                    }
                })
            });
        }).catch(error => {
            succesfull = false;
            res.status(500).send("Server Error: " + error);
            return;
        })
    setTimeout(() => {
        if (succesfull === true ||succesfull === false) return;
        succesfull = false;
        res.status(500).send("Server error api call timeout");
        return;
    }, 5000)
});

router.post('/add', (req, res) => {
    const { studentId, name, dateOfBirth } = req.body;
    Student.findOne({ studentId })
        .then((oldStudent) => {
            if (oldStudent) {
                res.status(400).send("Student of this id is already added");
                return;
            }
            if (!studentId || !name || !dateOfBirth) {
                res.status(400).send("Please provide all details studentId, name, Date of Birth");
                return;
            }
            if (typeof (dateOfBirth) != 'string') {
                res.status(400).send("Date format should be MM/DD/YYYY");
                return;
            }
            if (typeof (dateOfBirth) == 'string' && !(new Date(dateOfBirth))) {
                res.status(400).send("Date format is should be MM/DD/YYYY")
                return;
            }
            let date = dateOfBirth;
            if (typeof (dateOfBirth) === 'string') {
                date = new Date(dateOfBirth);
            }
            const student = new Student({ studentId, name, dateOfBirth: date });
            student.save()
                .then(() => {
                    res.status(200).send("Student Detail added succesfully!");
                    return;
                }).catch(error => {
                    console.log(error);
                    res.status(500).send("Server Error or Date check Date format it should be MM/DD/YYYY");
                    return;
                })
        }).catch(error => {
            res.status(500).send("Server error: " + error);
            return;
        });

});

router.put('/update/:id', (req, res) => {
    const studentId = req.params.id;
    const { name, dateOfBirth } = req.body;
    if (!studentId) {
        res.status(400).send("");
        return;
    }
    if (!name && !dateOfBirth) {
        res.status(400).send("Please provide any minimum 1 data of details studentId, name, Date of Birth");
        return;
    }
    const updatedStudent = {};
    if (name) {
        updatedStudent['name'] = name;
    }
    if (dateOfBirth) {
        updatedStudent['dateOfBirth'] = dateOfBirth;
    }

    Student.findOne({ studentId })
        .then((student) => {
            if (!student) {
                res.status(404).send("Student Id not found");
                return;
            }
            Student.updateOne({ studentId }, [
                { $set: updatedStudent }
            ]).then(() => {
                res.status(200).send("Student Details updated succesfully");
                return;
            }).catch((error) => {
                res.status(500).send(error);
                return;
            })
        }).catch(error => {
            console.log(error);
            res.status(500).send("Server Error");
            return;
        })
});

module.exports = router;