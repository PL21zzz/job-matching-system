import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  // Chạy vào lúc 00:00 mỗi ngày
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCleanPendingUsers() {
    this.logger.debug('Bắt đầu dọn dẹp tài khoản chưa kích hoạt...');

    // Tính thời điểm 24h trước
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    // Xóa các user có status là PENDING và tạo trước thời điểm 24h trước
    const deleteResult = await this.prisma.user.deleteMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: oneDayAgo, // lt = less than (nhỏ hơn/trước đó)
        },
      },
    });

    this.logger.debug(`Đã dọn dẹp xong ${deleteResult.count} tài khoản rác.`);
  }
}
