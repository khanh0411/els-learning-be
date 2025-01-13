const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkToken = (req, res, next) => {
    const authorization = req.headers['authorization'];
    const token = authorization && authorization.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.YOUR_JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded.user;
        next();
    });
};
const checkToken2 = (req, res, next) => {
    const authorization = req.headers['authorization'];
    const token = authorization && authorization.split(' ')[1];
   
    jwt.verify(token, process.env.YOUR_JWT_SECRET, (err, decoded) => {
        if (err) {
            req.user = null;
            next();
        }else{
            req.user = decoded.user;
            next();
        }
    });
};

const checkResetToken = (req, res, next) => {
    const authorization = req.headers['authorization'];
    const token = authorization && authorization.split(' ')[1];
    console.log(token);
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.RESET_PASSWORD_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate reset token' });
        }
        req.user = decoded.user;
        next();
    });
};

const checkAdmin = (req, res, next) => {
    if (req.user.role !== 1) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
    }
    next();
};
const checkTeacher = (req, res, next) => {
    if(req.user.role == 3){
        return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
    }
    next();
};
module.exports = { checkToken, checkResetToken, checkAdmin ,checkTeacher,checkToken2};
