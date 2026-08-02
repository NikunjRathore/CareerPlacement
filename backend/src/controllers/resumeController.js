const Resume= require("../models/Resume");
const pdfParse= require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

exports.returnAnalysis= async (req,res)=>{
    try{
        const user = req.user;
        const resume= await Resume.findOne({user:user._id})
        if(!resume) return res.status(200).json(null);
        const {priority_improvements, score, final_feedback}= resume;
        const analysis= {priority_improvements,score,final_feedback};
        return res.status(200).json(analysis);
    }catch(err){
        console.log(`Error in returning analysis: ${err}`)
    }
}


exports.addResume= async (req,res) => {
    try{
        const {job_description }= req.body;
        const dataBuffer= req.file.buffer;
        const pdfData = await pdfParse(dataBuffer);

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
        const prompt = `
        You are an expert ATS (Applicant Tracking System) resume evaluator and senior technical recruiter.

        Your task is to compare the following resume with the provided job description and generate a professional ATS analysis.

        RESUME:
        ------------------------
        ${pdfData.text}
        ------------------------

        JOB DESCRIPTION:
        ------------------------
        ${job_description}
        ------------------------

        Instructions:
        1. Carefully analyze how well the resume matches the job description.
        2. Consider:
        - Technical skills
        - Soft skills
        - Experience
        - Projects
        - Education
        - Certifications
        - Resume formatting
        - ATS friendliness
        - Keyword matching
        3. Assume this resume is submitted to a modern ATS before being reviewed by a recruiter.

        Return ONLY valid JSON.
        Do NOT include markdown.
        Do NOT wrap the JSON inside \`\`\`.

        Return exactly in the following format:

        {
        "ats_score": number,
        "priority_improvements": [
            {
            "priority": "High",
            "issue": "",
            "solution": ""
            }
        ],
        "final_recommendation": ""
        }

        Scoring Guidelines:
        - ATS Score should be between 0 and 100.
        - Priority should be among High, Medium or Low only. 
        - Be realistic and critical instead of overly generous.
        - Base your evaluation only on the supplied resume and job description.
        `;
        const interaction = await ai.interactions.create({
            model: "gemini-3.6-flash",
            input: prompt,
        });
        try{
            const result= JSON.parse(interaction.output_text);
            console.log('Resume analysed properly.')
            await Resume.findOneAndDelete({user: req.user._id});
            const resume= new Resume({
                user: req.user._id,
                job_description,
                score: result.ats_score,
                priority_improvements: result.priority_improvements,
                final_feedback: result.final_recommendation
            })
            await resume.save();
            return res.status(200).json('successfully analysed');

        }catch(err){
            console.log(`AI give unstructured data or unparsable data: ${err}`)
        }
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Server error', message: err.message});
    }
}