const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    employeeId:{
        type: Number,
        required: true
    },
    employeeName:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
})

module.exports = new mongoose.model('Employee', employeeSchema);
// colletion of name employees is formed here.