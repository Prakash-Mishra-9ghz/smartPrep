const mongoose = require("mongoose")

/**
 * - job desciption : string
 * - resume test : string
 * - self desciption : string
 * 
 * - matchScore: number
 * 
 * - technical question : 
 *              [{ question : "",
 *                  intetion : "",
 *                  answer: ""
 *              }]
 * - behaviour question : 
 *              [{ question : "",
 *                  intetion : "",
 *                  answer: ""
 *              }]
 * - skill gaps :
 *               [{
 *              skill: {},
 *              severity: {
 *                  type: string,
 *                  enum : ["low", "medium", "high"]
 *                  }
 *              }]
 * - preparation plan : 
 *          [{
 *          day:  Number,
 *             focus: String,
 *              task: [String]
 *          }]
 */
const technicalInterviewSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true,"intention question is required"]
    },
    answer: {
        type: String,
        required: [true, "answer question is required"]
    }
}, {
    _id: false
})

const behaviouralInterviewSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true,"intention question is required"]
    },
    answer: {
        type: String,
        required: [true, "answer question is required"]
    }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "severity  is required"]
    }
}, {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: String,
        required: [true, "Day is required"] 
    },
    focus: {
        type: String,
        required: [true, "focus question is required"] 
    },
    tasks : [{
        type: String,
        required: [true, "task question is required"] 
    }]
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"],
    },
    resume: {
        type: String
    },
    selfDescription: {
        type: String,
    },
    matchScore : {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions: [technicalInterviewSchema],
    behavioralQuestions: [behaviouralInterviewSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
}, {
    timeStamps: true
})

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema)
module.exports = interviewReportModel
