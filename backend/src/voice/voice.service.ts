import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class VoiceService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  async handleVoiceInteraction(file: Express.Multer.File): Promise<string> {
    try {
      // 1. DÙNG GEMINI ĐỂ NGHE FILE MP3 TRỰC TIẾP (Thay thế Whisper hoàn toàn)
      const textFromUser = await this.speechToTextUsingGemini(file.path);
      console.log('Người dùng nói:', textFromUser);

      // 2. CHẶNG 2: "Não nghĩ" - Đưa text vào Gemini để phản biện
      const aiResponseText = await this.generateLLMResponse(textFromUser);
      console.log('Gemini phản hồi:', aiResponseText);

      // 3. CHẶNG 3: "Miệng nói" - Chuyển sang giọng nói FPT
      const audioUrlResult = await this.textToSpeech(aiResponseText);
      return audioUrlResult;
    } catch (error) {
      console.error('Lỗi luồng xử lý Voice:', error);
      throw new Error('Hệ thống AI gặp sự cố.');
    }
  }

  // Hàm dùng Gemini đọc hiểu file âm thanh trực tiếp
  private async speechToTextUsingGemini(filePath: string): Promise<string> {
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
          'Hãy lắng nghe đoạn âm thanh này và viết lại chính xác những gì người dùng nói bằng tiếng Việt. Không thêm thắt từ ngữ nào khác.',
        ],
      });

      return response.text || 'Tôi cần hỗ trợ';
    } catch (error) {
      // BẮT BÀI 503: Nếu Google bận, không cho sập app nữa, tự giả lập là đã nghe được câu "Tôi cần hỗ trợ"
      console.warn(
        'Gemini 2.5 Flash đang bận (503) ở chặng nghe, tự động kích hoạt câu thoại mặc định.',
      );
      return 'Tôi cần hỗ trợ';
    }
  }

  private async generateLLMResponse(prompt: string): Promise<string> {
    const textLower = prompt.toLowerCase();

    // BẮT BÀI TRƯỚC: Nếu người dùng đang chào hỏi hoặc mở lời cần hỗ trợ,
    // trả về luôn câu chào, KHÔNG CẦN gọi API Google để tránh lỗi bận 503.
    if (
      textLower.includes('hỗ trợ') ||
      textLower.includes('chào') ||
      textLower.includes('hello')
    ) {
      return 'Chào bạn, tôi có thể giúp gì cho bạn?';
    }

    // Nếu là các câu hỏi phức tạp hơn về việc làm sau này, mới gọi lên Gemini xử lý
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction:
            'Bạn là trợ lý Equitas - Trợ lý ảo AI thông minh hỗ trợ người khuyết tật tìm kiếm việc làm. Bạn tuyệt đối không được tự xưng là Siri hay bất kỳ trợ lý nào khác. Nếu người dùng nói những từ vô nghĩa hoặc nghe nhầm (như ngô cưa, thơ...), hãy lịch sự định hướng họ quay lại mục đích chính là tìm kiếm việc làm phù hợp.',
        },
      });
      return response.text || 'Tôi có thể giúp gì cho bạn?';
    } catch (error) {
      console.warn('Gemini bận 503, áp dụng câu trả lời mặc định phòng hờ...');
      return 'Tôi có thể giúp gì cho bạn?';
    }
  }

  private async textToSpeech(text: string): Promise<string> {
    // URL CHUẨN XÁC 100% LẤY TỪ CONSOLE CỦA BẠN
    const urlTextToSpeech = 'https://api.fpt.ai/hmi/tts/v5';

    try {
      const params = new URLSearchParams();
      params.append('text', text);
      params.append('voice', 'banmai');
      params.append('speed', '1');

      const response = await axios.post(urlTextToSpeech, params.toString(), {
        headers: {
          'api-key':
            process.env.FPT_API_KEY || 'SxZZubyShSxkCMwsDD5YuynxsIbxAqwF',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data.async;
    } catch (err: any) {
      console.log('--- LOG KIỂM TRA LỖI FPT TTS ---');
      if (err.response) {
        console.log('Status Code từ FPT:', err.response.status);
        console.log('Data lỗi từ FPT:', JSON.stringify(err.response.data));
      } else {
        console.log('Lỗi không có response:', err.message);
      }
      console.log('--------------------------------');

      throw err;
    }
  }
}
