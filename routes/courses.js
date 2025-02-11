var express = require('express');
var router = express.Router();

const courses = {};

const lecturers = ["Vasya", "Olya", "Vova", "Yuri", "Eduard", "Irina"];
const courseNames = ["Front-End", "JAVA", "Back-End", "Node", "AWS", "C++"];
const hoursMin = 100;
const hoursMax = 600;
const idPattern = /^J\d{3}$/;
const lectureFormat = ["online", "offline", "hybrid"];
const Joi = require('joi');
const schemaCoursePost = Joi.object({
    id: Joi.string()
        .alphanum()
        .pattern(idPattern)
        .required(),
    name: Joi.any()
        .valid(...courseNames)
        .required(),
    lecturer: Joi.any().valid(...lecturers).required(),
    hours: Joi.number().integer().min(hoursMin).max(hoursMax).required(),
    format: Joi.any().valid(...lectureFormat).required(),
});
const schemaCoursePut = Joi.object({
    id: Joi.string()
        .alphanum()
        .pattern(idPattern),
    name: Joi.any().valid(...courseNames),
    lecturer: Joi.any().valid(...lecturers),
    hours: Joi.number().integer().min(hoursMin).max(hoursMax),
    format: Joi.any().valid(...lectureFormat),
});

/* GET courses listing. */
router.get('/', function(request, response, next) {
    if (!courses || Object.keys(courses).length === 0) {
        return response.status(404).json({ message: "No courses found" });
    }

    response.statusCode = 200;
    response.statusText = 'OK';
    response.json(Object.values(courses));
});

/* GET courses listing with filtering. */
router.get('/filter', (request, response) => {
    const { lecturer, hours, name } = request.query;

    if (!courses || Object.keys(courses).length === 0) {
        return response.status(404).json({ message: "No courses found" });
    }

    const filteredCourses = Object.values(courses).filter(c =>
        (!lecturer || c.lecturer.toLowerCase() === lecturer.toLowerCase()) &&
        (!hours || c.hours === parseInt(hours)) &&
        (!name || c.name.toLowerCase().includes(name.toLowerCase()))
    );

    response.json(filteredCourses);
});

router.post('/', (request, response) => {
    const id = request.body.id;
    const { error } = schemaCoursePost.validate(request.body);
    if (error) {
        return response.status(400).json({ error: error.details[0].message });
    }
    courses[id] = request.body;
    response.statusCode = 200;
    response.statusText = 'OK';
    response.statusMessage = 'The course was created';
    response.send();
});

router.delete('/:id', (request, response) => {
    const id = request.params.id;
    if (courses[id]) {
        const deletedCourse = courses[id];
        delete courses[id];
        response.status(200).json({
            success: true,
            message: 'The course was deleted',
            deletedCourse: deletedCourse
        });
    } else {
        response.status(404).json({ message: 'Course [' + id + '] not found' });
    }
});

router.put('/:id', (request, response) => {
    const id = request.params.id;
    if (courses[id]) {
        const { error } = schemaCoursePut.validate(request.body);
        if (error) {
            return response.status(400).json({ error: error.details[0].message });
        }
        courses[id] = {...courses[id], ...request.body};
        response.status(200).json({
            success: true,
            message: 'The course was updated',
            updatedCourse: courses[id]
        });
    } else {
        response.status(404).json({ message: 'Course [' + id + '] not found' });
    }
});

module.exports = router;
