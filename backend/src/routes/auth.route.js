const {Router} = require('express');
const authController = require('../controllers/auth.controller');
const authRouter = Router();
const authMiddleware = require('../middlewares/auth.middleware')

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post('/login', authController.loginUser);

/**
 * @route GET /api/auth/logout
 * @desc clear token from user cookie and add to blacklist
 * @access Public
 */
authRouter.get('/logout', authController.logoutUser)

/**
 * @route GET /api/auth/get-me
 * @description Get the currently logged in user
 * @access Private
 */
authRouter.get('/get-me', authMiddleware.authUser, authController.getMe)

module.exports = authRouter;