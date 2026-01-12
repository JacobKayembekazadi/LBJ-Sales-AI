
import { SYSTEM_INSTRUCTION } from "../constants";
import { GeminiResponse, ChatMessage, FileData } from "../types";

export class SalesAIService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  async processLead(history: ChatMessage[], newPrompt: string, fileData?: FileData): Promise<GeminiResponse> {
    const conversationContext = history
      .map(m => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    const userContent = `
Conversation History:
${conversationContext}

New Input from Client:
${newPrompt || (fileData ? "Please analyze the attached document." : "")}

${fileData ? `The user has also uploaded a file named: ${fileData.fileName}. Please incorporate its contents.` : ""}
`;

    const messages = [
      { role: 'system' as const, content: SYSTEM_INSTRUCTION },
      { role: 'user' as const, content: userContent }
    ];

    // If there's file data, include it as a vision message for images
    if (fileData && fileData.inlineData.mimeType.startsWith('image/')) {
      messages[1] = {
        role: 'user' as const,
        content: [
          { type: 'text', text: userContent },
          {
            type: 'image_url',
            image_url: {
              url: `data:${fileData.inlineData.mimeType};base64,${fileData.inlineData.data}`
            }
          }
        ] as any
      };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to get response from AI');
    }

    const data = await response.json();

    try {
      const result = JSON.parse(data.choices[0].message.content) as GeminiResponse;
      return result;
    } catch (error) {
      console.error("Failed to parse AI response", error);
      throw new Error("Invalid response format from AI");
    }
  }
}
