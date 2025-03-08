const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => jwt.sign({id: id}, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES_IN
});

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + 
        process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production') cookieOptions.scure = true;
    res.cookie('jwt', token, cookieOptions);

    // Remove the password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: user
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
});

exports.login = catchAsync( async (req, res, next) =>{
    const { email, password } = req.body;

    // if email and password exist
    if(!email || !password) {
        return next( new AppError('Please provide email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');
   
    if(!user || !(await user.correctPassword(password, user.password)))
    {
        return next(new AppError('Incorrect email or password!', 401));
    }
  
    createSendToken(user, 200, res);
});

exports.protect = catchAsync( async (req,res,next)=>{
    // 1) Getting tkoen and check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('You are not logged in, please log in...'), 401);
    }
    
    // 2) Varification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    // 3) Check if user still exsits
    const currentUser = await User.findById(decoded.id);

    if(!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
}

);

exports.restrictTo = (...roles) => (req, res, next) => {
    // rolses ['admin'] role = 'user'
    if(!roles.includes(req.user.role)){
        return next(new AppError('You do not have permission to perform this action', 403 ));
    }
    next();
}