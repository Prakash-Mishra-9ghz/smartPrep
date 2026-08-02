const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const interviewController = require('../controllers/interview.controller')
const upload = require('../middlewares/file.middleware')

const interviewRouter = express.Router()

/**
 * @route POST /api/interview
 * @desc generate new interview report on the basis of self description, resume pdf and job description 
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume") ,interviewController.generateInterviewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @desc get interview report by interview Id
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)

/**
 * @route GET /api/interview
 * @desc get all interview reports of the logged in user
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

module.exports = interviewRouter