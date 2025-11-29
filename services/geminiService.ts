import { GoogleGenerativeAI } from "@google/generative-ai";
import { Student } from "../types"; // Adjust path if needed

// 1. Get the Key using Vite's special syntax
// Make sure you named your variable VITE_GEMINI_API_KEY in Vercel/Render
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// 2. Initialize the AI
// We use a safety check to prevent crashing if the key is missing
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateStudentReport = async (student: Student): Promise<string> => {
  if (!API_KEY) return "API Key is missing. Please check settings.";

  try {
    const prompt = `
      You are an academic advisor at the Mogadishu School System.
      Generate a short, professional progress report (max 100 words) for a parent based on the following student data:
      Name: ${student.fullName}
      Grade: ${student.class}
      Attendance: ${student.attendance}%
      Teacher Notes: ${student.lastPerformanceReview || "No notes"}
      
      Tone: Encouraging but honest.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating report:", error);
    return "Error communicating with AI service. Please try again later.";
  }
};

export const generateSchoolInsights = async (stats: any): Promise<string> => {
  if (!API_KEY) return "API Key is missing.";

  try {
    const prompt = `
      Analyze these school statistics for Mogadishu School System and provide 3 key strategic bullet points for the principal to improve the school:
      Total Students: ${stats.totalStudents}
      Attendance Rate: ${stats.avgAttendance}%
      Revenue: $${stats.revenue}
      
      Focus on growth and academic excellence.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Unavailable.";
  }
};