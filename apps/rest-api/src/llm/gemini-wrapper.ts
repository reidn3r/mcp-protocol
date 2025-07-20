import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { serverConfig } from 'src/config/server.config';

@Injectable()
export class GeminiProvider {
  private model: GenerativeModel;

  constructor() {
    const ai = new GoogleGenerativeAI(
      serverConfig.modelConfig.apiKey as string,
    );
    this.model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: serverConfig.modelParams,
    });
  }

  async generate(prompt: string): Promise<string> {
    const res = await this.model.generateContent(prompt);
    return res.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  }
}
