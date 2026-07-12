const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const BlacklistModel = require('../models/blacklist.model');

/**
 * Register a new user
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
async function registerUser(req, res) {
    const { username, email, password } = req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            message: 'Please provide username, email and password'
        })
    }

    const userAlreadyExists = await UserModel.findOne({
        $or: [{ username }, { email }]
    })

    if(userAlreadyExists){
        return res.status(400).json({
            message: 'Username or email already exists'
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = await UserModel.create({
        username,
        email,
        password: hashedPassword
    })

    const token = jwt.sign(
        { id: newuser._id, username: newuser.username },
        process.env.JWT_SECRET,
        {expiresIn : '1h'}
    )

    res.cookie('token', token)

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: newuser._id,
            username: newuser.username,
            email: newuser.email
        }
    })
}

/**
 * Login a user
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
async function loginUser(req, res) {
    const {email, password} = req.body;

    const userExists = await UserModel.findOne({email})

    if(!userExists){
        return res.status(400).json({
            message: 'User does not exist'
        })
    }

    const isPasswordValid = await bcrypt.compare(password, userExists.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message: 'Invalid password'
        })
    }

    const token = jwt.sign(
        { id: userExists._id, username: userExists.username },
        process.env.JWT_SECRET,
        {expiresIn : '1h'}
    )

    res.cookie('token', token)
    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            id: userExists._id,
            username: userExists.username,
            email: userExists.email
        }
    }) 
}

/**
 * @route GET /api/auth/logout
 * @desc clear token from user cookie and add to blacklist
 * @access Public
 */
async function logoutUser(req, res) {
    const token = req.cookies.token;
    
    if(token){
        // Add the token to the blacklist
        await BlacklistModel.create({ token });
    }

    res.clearCookie('token');

    res.status(200).json({
        message : "user logged out successfully"
    })
}

/**
 * @route GET /api/auth/get-me
 * @description Get the currently logged in user
 * @access Private
 */
async function getMe(req, res) {
    const user = await UserModel.findById(req.user.id)

    res.status(200).json({
        message: "User fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getMe
}