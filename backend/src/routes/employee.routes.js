const express = require('express');
const { getProgress, updateProgress } = require('./controllers/employee.controllers.js');

const employeeRouter = express.Router();

employeeRouter.get('/progress', getProgress);
employeeRouter.post('/progress', updateProgress);

module.exports = { employeeRouter };