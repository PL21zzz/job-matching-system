import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { VoiceService } from './voice.service';

@Controller('api/voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Post('interact')
  // Cấu hình interceptor để lưu file audio tạm thời vào thư mục ./uploads
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(16)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadVoice(@UploadedFile() file: Express.Multer.File) {
    // Chuyển file xuống Service xử lý chuỗi AI và lấy về link file mp3 kết quả
    const resultAudioUrl = await this.voiceService.handleVoiceInteraction(file);

    // Trả link audio phản hồi về cho Android phát ra loa
    return { audioUrl: resultAudioUrl };
  }
}
