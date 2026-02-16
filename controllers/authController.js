const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

const sendAuthResponse = (user, statusCode, res) => {
    const token = signToken(user._id);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: { user },
    });
};

exports.protect = async (req, res, next) => {
 


    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                status: 'fail',
                message: 'You are not logged in. Please log in to get access.',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
         const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({
                status: 'fail',
                message: 'The user belonging to this token no longer exists.',
            });
        }

        req.user = currentUser;
        next();
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: 'Invalid or expired token',
        });
    }
};
// Handle user sign-up requests

exports.signup = async (req, res) => {
    try {
        const { name, email, photo, password, passwordConfirm } = req.body;

        const newUser = await User.create({
            name,
            email,
            photo,
            password,
            passwordConfirm,
        });

        sendAuthResponse(newUser, 201, res);
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};

// Handle user login requests
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide email and password',
            });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password',
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({
                status: 'fail',
                message: 'Invalid email or password',
            });
        }

        sendAuthResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Unable to log in user',
        });
    }
};


// exports.restrict = (...roles) => (req, res, next) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//         return res.status(403).json({
//             status: 'fail',
//             message: 'You do not have permission to perform this action',
//         });
//     }
//     next();
// };

exports.restrictTo=(...roles)=>(req,res,next)=>{
    console.log(roles)
    if(!req.user || !roles.includes(req.user.role))
    {
        return res.status(403).json({
            status:'failed',
            message:"YOU DO NOT HAVE PRIVILIGE TO SEE THIS PAGE 😔😔😔😔😔😔"
        })
    }
    next();
}