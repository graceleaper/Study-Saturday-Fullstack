const router = require("express").Router();
const Student = require("../db/models/students");
const Test = require("../db/models/tests");

router.get("/:studentId", function(req, res, next) {
  Student.findById(req.params.studentId)
    .then(student => {
      if (!student) return res.sendStatus(404);
      res.json(student);
    })
    .catch(next);
});

router.get("/", function(req, res, next) {
  Student.findAll({ include: { all: true } }).then(students =>
    res.json(students)
  );
});

router.put("/:id", function(req, res, next) {
  Student.update(req.body, {
    where: {
      id: req.params.id
    },
    returning: true
  })
    .then(test => res.status(201).json(test[1][0]))
    .catch(next);
});

//initial post request
// router.post("/", async (req, res, next) => {
//   try {
//     // console.log('made it to route')
//     const newStudent = await Student.create(req.body);
//     // console.log(newStudent)
//     const test = {
//       subject: 'English',
//       grade: 88,
//       studentId: newStudent.id
//     };
//     await Test.create(test);
//     res.json(newStudent); //send student eagerloaded with the test?
//   } catch (err) {
//     next(err);
//   }
// });

router.post("/", async (req, res, next) => {
  try {
    //await to make sure we have info for use next time
    const newStudent = await Student.create(req.body);
    //create test to go in our 'test' model in our 'study-saturdays' database
    const test = await Test.create({
      subject: "English",
      grade: 88,
      studentId: newStudent.id
    });
    //findById() is deprecated... so we can use findOne by findByPk()
    //in our query, create association between student and table models
    //note: https://sequelizedocs.fullstackacademy.com/eager-loading/
    const newStudentTest = await Student.findByPk(newStudent.id, {include: [{model: Test}]});
    res.json(newStudentTest); //res.json allows null and defined, whereas res.send will not
    //our newStudentTest will be our newStudent object, but also include test
  } catch (err) {
    //if there's error, move on to next route
    next(err);
  }
});

router.delete("/:id", function(req, res, next) {
  Student.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
});

module.exports = router;
