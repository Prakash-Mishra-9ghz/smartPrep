const { GoogleGenAI } = require("@google/genai")
const {z} = require("zod")
const {zodToJsonSchema} = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEN_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profle matches the job desciption"),
  technicalQuestions: z.array(z.object({
        question: z.string()
            .describe("A realistic technical interview question tailored to the target role. The question should be specific, commonly asked in interviews, and relevant to the candidate's experience."),
        intention: z.string()
            .describe("Explain what the interviewer is evaluating by asking this question, such as technical knowledge, problem-solving ability, system design skills, debugging skills, coding proficiency, or communication."),
        answer: z.string()
            .describe("Provide a structured, interview-ready answer. Explain the ideal approach, important concepts to mention, reasoning behind the solution, best practices, common mistakes to avoid, and any relevant examples where appropriate.")
      })
    ).describe("Generate 8–15 role-specific technical interview questions. Each question must include the interviewer's intention and a comprehensive interview-ready answer."),
  behaviouralQuestions: z.array(z.object({
        question: z.string()
            .describe("A realistic behavioural interview question commonly asked for the target role."),
        intention: z.string()
            .describe("Describe the competencies being assessed, such as leadership, teamwork, ownership, communication, adaptability, conflict resolution, time management, or decision-making."),
        answer: z.string()
            .describe("Provide a complete answer using the STAR (Situation, Task, Action, Result) framework. Include realistic examples, measurable outcomes where possible, and tips for communicating the answer confidently.")
      })
    ).describe("Generate 5–10 behavioural interview questions with the interviewer's intention and a well-structured STAR-based sample answer."),
  skillGaps: z.array(z.object({
        skill: z.string()
            .describe("A specific technical or soft skill the candidate should improve before the interview based on the job requirements and candidate profile."),
        severity: z.enum(["low", "medium", "high"])
            .describe("Rate the importance of improving this skill before the interview: low (nice to have), medium (recommended), or high (critical for interview success).")
      })
    ).describe("List the candidate's most important skill gaps in order of priority, including a severity rating for each."),
  preparationPlan: z.array(z.object({
        day: z.string()
            .describe("The preparation day label, such as Day 1, Day 2, or Day 3."),
        focus: z.string()
            .describe("The primary learning objective or interview topic to focus on during this day."),
        tasks: z.array(z.string()
            .describe("A specific, actionable preparation task that can reasonably be completed during the day.")
          ).describe("A prioritized checklist of practical tasks to complete for the day's preparation.")
      })
    ).describe("Create a practical day-by-day interview preparation plan. Each day should focus on one major topic and include multiple actionable tasks that progressively improve interview readiness."),
  title: z.string().describe("The title of the job for which the interview report is generated")
});

async function generateInterviewReport({resume, selfDescription, jobDescription}) {

    const prompt = `
    Generate an interview report for a candidate based on the following information:
    Resume: ${resume}
    self Description: ${selfDescription}
    jobDescription: ${jobDescription}`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: z.toJSONSchema(interviewReportSchema)
        }
    })

    return JSON.parse(response.text)
    //console.log(JSON.stringify(z.toJSONSchema(interviewReportSchema), null, 2));
}

module.exports = {generateInterviewReport}