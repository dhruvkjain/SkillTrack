const employees = require('../../models/employee.model.js')
const { v4: uuidv4 } = require('uuid');
const { hashPassword, comparePassword, generateTokenAndSetCookie } = require('../../utils');

async function signup(req, res) {
    try {
        const { employeeName, password, confirmPassword } = req.body;
        if (!employeeName || !password || !confirmPassword) {
            return res.status(400).json({ error: 'Insufficient data' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }
        const employee = await employees.findOne({ employeeName: employeeName })
        if (employee) {
            return res.status(400).json({ error: "Employee already exist" })
        }

        const hashedPassword = await hashPassword(password);

        const newEmployee = new employees({
            employeeId: uuidv4(),
            employeeName,
            password: hashedPassword
        })

        if (newEmployee) {
            generateTokenAndSetCookie(newEmployee.employeeId , res);
            await newEmployee.save();

            res.status(201).json({
                employeeId: newEmployee.employeeId,
                employeeName: newEmployee.employeeName
            });
        }
        else{
            return res.status(400).json({error: "Invalid user data"});
        }
    } catch (err) {
        console.log("Error in signup controller",err.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}

async function login(req, res) {
    try{
        const { employeeName, password } = req.body;
        if (!employeeName || !password) {
            return res.status(400).json({ error: 'Insufficient data' });
        }

        const isEmployeeExist = await employees.findOne({username});
        if(isEmployeeExist){
            const isPasswordCorrect = await comparePassword(password, isEmployeeExist.password);
            
            if(isPasswordCorrect){
                generateTokenAndSetCookie(isEmployeeExist.employeeId, res);
                return res.status(200).json({
                    employeeId: isEmployeeExist.employeeId,
                    employeeName: isEmployeeExist.employeeName
                })
            }
            else{
                return res.status(400).json({ error: 'Invalid username or password' });
            }
        }
        else{
            return res.status(400).json({ error: 'Invalid username or password' });
        }
    } catch (err) {
        console.log("Error in login controller", err.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}

async function logout(req, res) {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out succesfully"});
    } catch (err) {
        console.log("Error in logout controller", err.message);
        res.status(500).json({ error: "Internal Server error" });
    }
}

module.exports = { signup, login, logout }