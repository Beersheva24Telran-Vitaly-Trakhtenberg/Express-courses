/*
router.post('/api/v1/courses', (request, response) => {
    courses.id = request.body.id;
    response.statusCode = 200;
    response.statusText = 'OK';
    response.statusMessage = 'The course was created';
    response.send();
});

router.get('/api/v1/courses', (request, response) => {
    const id = request.body.id;
    courses[id] = request.body;
    console.log(courses);
    response.status(201).send(courses[id]);
});
*/
var express = require('express');
var router = express.Router();

const courses = {};

/* GET courses listing. */
router.get('/', function(request, response, next) {
    response.statusCode = 200;
    response.statusText = 'OK';
    response.json(Object.values(courses));
    // response.send(); // to prevent error after response.json() = "Cannot set headers after they are sent to the client".
});

/* GET courses listing with filtering. */
router.get('/filter', (request, response) => {
    const { lecturer, hours, name } = request.query;

    const filteredCourses = Object.values(courses).filter(c =>
        (!lecturer || c.lecturer.toLowerCase() === lecturer.toLowerCase()) &&
        (!hours || c.hours === parseInt(hours)) &&
        (!name || c.name.toLowerCase().includes(name.toLowerCase()))
    );

    response.json(filteredCourses);
});

router.post('/', (request, response) => {
    const id = request.body.id;
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
