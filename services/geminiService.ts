import { GoogleGenAI } from "@google/genai";
import { Student } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudentReport = async (student: Student): Promise<string> => {
  try {
    const prompt = `
      You are an academic advisor at the Mogadishu School System.
      Generate a short, professional progress report (max 100 words) for a parent based on the following student data:
      Name: ${student.fullName}
      Grade: ${student.class}
      Attendance: ${student.attendance}%
      Teacher Notes: ${student.lastPerformanceReview}
      
      Tone: Encouraging but honest.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate report.";
  } catch (error) {
    console.error("Error generating report:", error);
    return "Error communicating with AI service. Please try again later.";
  }
};

export const generateSchoolInsights = async (stats: any): Promise<string> => {
  try {
    const prompt = `
      Analyze these school statistics for Mogadishu School System and provide 3 key strategic bullet points for the principal to improve the school:
      Total Students: ${stats.totalStudents}
      Attendance Rate: ${stats.avgAttendance}%
      Revenue: $${stats.revenue}
      
      Focus on growth and academic excellence.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate insights.";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Unavailable.";
  }
};