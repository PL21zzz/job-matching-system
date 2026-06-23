import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class VoiceService {
  private readonly ai?: GoogleGenAI;

  constructor() {
    if (process.env.GEMINI_API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
  }

  async handleVoiceInteraction(file: Express.Multer.File): Promise<string> {
    try {
      const textFromUser = await this.speechToTextUsingGemini(file.path);
      const aiResponseText = await this.generateLLMResponse(textFromUser);
      return await this.textToSpeech(aiResponseText);
    } catch (error) {
      console.error('Lỗi luồng xử lý Voice:', error);
      throw new Error('Hệ thống AI gặp sự cố.');
    }
  }

  async synthesizeVietnamese(text: string): Promise<string | null> {
    if (!text?.trim() || !process.env.FPT_API_KEY) {
      return null;
    }

    try {
      return await this.textToSpeech(text.trim());
    } catch (error) {
      console.warn('FPT Ban Mai tạm thời chưa phản hồi:', error);
      return null;
    }
  }

  private async speechToTextUsingGemini(filePath: string): Promise<string> {
    if (!this.ai) {
      return 'Tôi cần hỗ trợ tìm việc làm phù hợp.';
    }

    const audioBuffer = fs.readFileSync(filePath);
    const base64Audio = audioBuffer.toString('base64');

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            inlineData: {
              mimeType: 'audio/mp3',
              data: base64Audio,
            },
          },
          'Hãy nghe đoạn âm thanh này và chép lại chính xác bằng tiếng Việt những gì người dùng nói. Không thêm bớt nội dung.',
        ],
      });

      return response.text || 'Tôi cần hỗ trợ tìm việc làm phù hợp.';
    } catch (error) {
      console.warn('Gemini đang bận ở bước nhận giọng nói:', error);
      return 'Tôi cần hỗ trợ tìm việc làm phù hợp.';
    }
  }

  private async generateLLMResponse(prompt: string): Promise<string> {
    if (!this.ai) {
      return 'Chào bạn, tôi có thể hỗ trợ bạn tìm việc làm phù hợp.';
    }

    const textLower = prompt.toLowerCase();

    if (
      textLower.includes('hỗ trợ') ||
      textLower.includes('chào') ||
      textLower.includes('hello')
    ) {
      return 'Chào bạn, tôi có thể giúp gì cho bạn?';
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction:
            'Bạn là trợ lý Equitas AI hỗ trợ người khuyết tật tìm kiếm việc làm. Hãy trả lời ngắn gọn, lịch sự, dễ nghe và bám đúng nhu cầu tìm việc.',
        },
      });
      return response.text || 'Tôi có thể giúp gì cho bạn?';
    } catch (error) {
      console.warn('Gemini đang bận ở bước phản hồi:', error);
      return 'Tôi có thể giúp gì cho bạn?';
    }
  }

  private async textToSpeech(text: string): Promise<string> {
    const urlTextToSpeech = 'https://api.fpt.ai/hmi/tts/v5';

    const params = new URLSearchParams();
    params.append('text', text);
    params.append('voice', 'banmai');
    params.append('speed', '-1');

    const response = await axios.post(urlTextToSpeech, params.toString(), {
      headers: {
        'api-key': process.env.FPT_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data?.async || null;
  }
}
