
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { GeminiResponse, ChatMessage, FileData } from "../types";

export class SalesAIService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async processLead(history: ChatMessage[], newPrompt: string, fileData?: FileData): Promise<GeminiResponse> {
    const model = 'gemini-3-pro-preview';
    
    const conversationContext = history
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    const textPart = {
      text: `
        Conversation History:
        ${conversationContext}
        
        New Input from Client:
        ${newPrompt || (fileData ? "Please analyze the attached document." : "")}
        
        ${fileData ? `The user has also uploaded a file named: ${fileData.fileName}. Please incorporate its contents.` : ""}
      `
    };

    const parts = [textPart];
    if (fileData) {
      parts.push({
        inlineData: fileData.inlineData
      } as any);
    }

    const response = await this.ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clientFriendlyResponse: { 
              type: Type.STRING,
              description: 'A warm, premium response to the user.'
            },
            salesBrief: {
              type: Type.OBJECT,
              properties: {
                clientName: { type: Type.STRING },
                projectType: { type: Type.STRING },
                location: { type: Type.STRING },
                budgetRange: { type: Type.STRING },
                timeline: { type: Type.STRING },
                designStyleSignals: { type: Type.STRING },
                keyGoals: { type: Type.STRING },
                potentialChallenges: { type: Type.STRING },
                urgencyLevel: { 
                  type: Type.STRING,
                  enum: ['Low', 'Medium', 'High', 'Critical']
                },
                recommendedNextStep: { type: Type.STRING }
              },
              required: ['clientName', 'projectType', 'location', 'budgetRange', 'timeline', 'designStyleSignals', 'keyGoals', 'potentialChallenges', 'urgencyLevel', 'recommendedNextStep']
            },
            actionDocument: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                preparedFor: { type: Type.STRING },
                date: { type: Type.STRING },
                executiveSummary: { type: Type.STRING },
                keyInsights: { type: Type.STRING },
                recommendedActions: { type: Type.STRING },
                plan30Day: { type: Type.STRING },
                plan60Day: { type: Type.STRING },
                plan90Day: { type: Type.STRING },
                ownershipAndRoles: { type: Type.STRING },
                successMetrics: { type: Type.STRING },
                pdfUsageInstructions: {
                  type: Type.OBJECT,
                  properties: {
                    whoShouldReceive: { type: Type.STRING },
                    meetingUsage: { type: Type.STRING },
                    decisionSupport: { type: Type.STRING },
                    immediateAction: { type: Type.STRING }
                  },
                  required: ['whoShouldReceive', 'meetingUsage', 'decisionSupport', 'immediateAction']
                }
              },
              required: [
                'title', 'preparedFor', 'date', 'executiveSummary', 'keyInsights', 
                'recommendedActions', 'plan30Day', 'plan60Day', 'plan90Day', 
                'ownershipAndRoles', 'successMetrics', 'pdfUsageInstructions'
              ]
            }
          },
          required: ['clientFriendlyResponse', 'salesBrief']
        }
      }
    });

    try {
      const result = JSON.parse(response.text || '{}') as GeminiResponse;
      return result;
    } catch (error) {
      console.error("Failed to parse AI response", error);
      throw new Error("Invalid response format from AI");
    }
  }
}
