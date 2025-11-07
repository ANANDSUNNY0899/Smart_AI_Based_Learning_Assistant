
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-pro';

export const explainConcept = async (topic: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `Please provide a clear and concise explanation of the following concept: "${topic}". Structure the explanation well for a beginner.`,
        });
        return response.text;
    } catch (error) {
        console.error("Error explaining concept:", error);
        throw new Error("Failed to get explanation from AI.");
    }
};

export const simplifyExplanation = async (topic: string, currentExplanation: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `The current explanation for "${topic}" is: "${currentExplanation}". Please provide a much simpler version of this explanation, using analogies if possible, suitable for someone with very little background knowledge.`,
        });
        return response.text;
    } catch (error) {
        console.error("Error simplifying explanation:", error);
        throw new Error("Failed to simplify explanation.");
    }
};

export const elaborateExplanation = async (topic: string, currentExplanation: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `The current explanation for "${topic}" is: "${currentExplanation}". Please elaborate on this explanation, providing more details, examples, and covering more advanced aspects of the topic.`,
        });
        return response.text;
    } catch (error) {
        console.error("Error elaborating explanation:", error);
        throw new Error("Failed to elaborate on explanation.");
    }
};

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `Generate a 5-question multiple-choice quiz about "${topic}". For each question, provide 4 options and clearly indicate the correct answer.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        quiz: {
                            type: Type.ARRAY,
                            description: "An array of quiz questions.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: {
                                        type: Type.STRING,
                                        description: "The quiz question."
                                    },
                                    options: {
                                        type: Type.ARRAY,
                                        description: "An array of 4 possible answers.",
                                        items: {
                                            type: Type.STRING
                                        }
                                    },
                                    correctAnswer: {
                                        type: Type.STRING,
                                        description: "The correct answer, which must be one of the options."
                                    }
                                },
                                required: ["question", "options", "correctAnswer"]
                            }
                        }
                    },
                    required: ["quiz"]
                }
            }
        });

        const jsonString = response.text;
        const parsed = JSON.parse(jsonString);
        return parsed.quiz;

    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz.");
    }
};
