import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

@Injectable()
export class StoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findPublished() {
    return this.prisma.testimonial.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: 30,
    });
  }

  async findMine(userId: string) {
    const profile = await this.getCandidate(userId);
    return this.prisma.testimonial.findMany({
      where: { authorId: profile.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateStoryDto) {
    const profile = await this.getCandidate(userId);
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    return this.prisma.testimonial.create({
      data: {
        title: dto.title.trim(),
        content: dto.content.trim(),
        authorName: user.fullName,
        authorRole: dto.authorRole?.trim() || 'Ứng viên Equitas',
        avatarUrl: dto.avatarUrl?.trim() || null,
        status: dto.status || 'PUBLISHED',
        authorId: profile.id,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdateStoryDto) {
    await this.assertOwner(userId, id);
    return this.prisma.testimonial.update({
      where: { id },
      data: {
        ...dto,
        title: dto.title?.trim(),
        content: dto.content?.trim(),
        authorRole: dto.authorRole?.trim(),
        avatarUrl: dto.avatarUrl?.trim(),
      },
    });
  }

  async remove(userId: string, id: string) {
    await this.assertOwner(userId, id);
    return this.prisma.testimonial.delete({ where: { id } });
  }

  private async getCandidate(userId: string) {
    const profile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new ForbiddenException('Chỉ ứng viên mới có thể đăng câu chuyện.');
    }
    return profile;
  }

  private async assertOwner(userId: string, id: string) {
    const profile = await this.getCandidate(userId);
    const story = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!story) throw new NotFoundException('Không tìm thấy bài viết.');
    if (story.authorId !== profile.id) {
      throw new ForbiddenException('Bạn không có quyền sửa bài viết này.');
    }
  }
}
