const pdfParse = require('pdf-parse')
const {generateInterviewReport} = require('../services/ai.service')
const interviewReportModel = require('../models/interviewReport.model');
const { intersection } = require('zod');

/**
 * @desc Controller generates interview report based on job desc, seld desc and resume
 */
async function generateInterviewReportController(req, res){
     if (!req.file) {
        return res.status(400).json({
            message: "Resume file is required."
        });
    }

    const resumeFile = req.file

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(resumeFile.buffer))).getText()

    const {selfDescription, jobDescription} = req.body

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully",
        interviewReport
    })
}

/**
 * @desc controller to get interview report by id
 */
async function getInterviewReportByIdController(req, res){
    const { interviewId } = req.params
    
    const interviewReport = await interviewReportModel.findOne({
        _id: interviewId, user: req.user.id
    })

    if(!interviewReport){
        return res.status(401).json({
            message: "interview report not found"
        })
    }

    return res.status(201).json({
        message: "interview report fetched successfully",
        interviewReport
    })
}

/**
 * @desc controller to get all interview report of logged in user
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 })
    .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    return res.status(201).json({
        message: "Interview reports fetched successfully",
        interviewReports
    })
}

module.exports = {generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController}