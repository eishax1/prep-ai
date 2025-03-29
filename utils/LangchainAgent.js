import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

export async function generateInterviewQuestions(jobPosition, jobDescription, jobExperience, questions) {
  console.log("Generating interview questions with:", {
    jobPosition,
    jobDescription,
    jobExperience,
    questions
  });

  const model = new ChatOpenAI({
    openAIApiKey: process.env.NEXT_PUBLIC_OPEN_API_KEY ,
    temperature: 0.7,
    response_format: "json"
  });

  const promptTemplate = new PromptTemplate({
    template: `
    You are a skilled technical interviewer. Here is how you reason about the interview:
    1. First, you analyze the job description to understand the key requirements.
    2. Then, you consider the candidate's experience level.

    Now, using your reasoning, generate  suitable {questions} interview questions.
    
    - Job Position: {jobPosition}
    - Job Description: {jobDescription}
    - Experience Level: {jobExperience} years

    Provide responses in JSON format as an array of objects where each object includes:
    - question: the interview question
    - answer: a detailed answer for the question
    
    For subjective questions (e.g., opinions, best practices, personal experiences), start the answer with:
    "Disclaimer: As an AI language model, my response is based on general best practices and publicly available knowledge. This may be subjective, and different experts may have varying opinions."
    Ensure the answers are clear, informative, and relevant to the specified job role and experience level.`,
    inputVariables: ["jobPosition", "jobDescription", "jobExperience", "questions"],
  });

  try {


    console.log("Inputs before formatting:", { jobPosition, jobDescription, jobExperience, questions });
    const formattedPrompt = await promptTemplate.format({
      jobPosition,
      jobDescription,
      jobExperience,
      questions 
    });

    console.log("Formatted Prompt Sent to OpenAI:", formattedPrompt);

    const response = await model.invoke(formattedPrompt);
    console.log("OpenAI Response Raw:", response.content);

    // Ensure the response is a valid JSON string and parse it
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(response.content);
      console.log("Parsed JSON Response:", jsonResponse);
    } catch (e) {
      console.error("Error parsing OpenAI response:", e);
      throw new Error("Failed to parse OpenAI response: " + e.message);
    }

    // Ensure the response is an array
    if (!Array.isArray(jsonResponse)) {
      console.error("AI response is not an array. Received:", jsonResponse);
      throw new Error("AI response is not an array of questions.");
    }
    const cleanedResponse = responseText.replace(/^```json\n|```$/g, ''); // Removes Markdown
    const parsedResponse = JSON.parse(cleanedResponse);


    console.log("Parsed Questions:", jsonResponse);
    return parsedResponse;
  } catch (error) {
    console.error("Error Processing OpenAI Response:", error);
    throw new Error("Failed to parse OpenAI response.");
  }
}
