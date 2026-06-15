const express = require('express');
const router = express.Router();
const courses = require('../controllers/courses');
const assignments = require('../controllers/assignments');

// Courses
router.get('/courses',     courses.getCourses);
router.post('/courses',    courses.createCourse);
router.delete('/courses/:id', courses.deleteCourse);

// Assignments
router.get('/assignments',        assignments.getAssignments);
router.post('/assignments',       assignments.createAssignment);
router.patch('/assignments/:id',  assignments.updateAssignment);
router.delete('/assignments/:id', assignments.deleteAssignment);

module.exports = router;
