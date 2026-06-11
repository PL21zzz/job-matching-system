import { Schema, SchemaType } from '@google/generative-ai';

export const CV_RESPONSE_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    jobTitle: {
      type: SchemaType.STRING,
      description:
        'Tiêu đề vị trí công việc viết bằng TIẾNG VIỆT, viết hoa toàn bộ (Ví dụ: LẬP TRÌNH VIÊN NODEJS INTERN).',
    },
    summary: {
      type: SchemaType.STRING,
      description:
        'Đoạn văn tóm tắt giới thiệu bản thân bằng TIẾNG VIỆT (khoảng 3-4 câu), gọt giũa khéo léo để làm nổi bật định hướng và năng lực của ứng viên phù hợp khít với mô tả công việc (JD), thể hiện tư duy vượt khó và đam mê công nghệ chuyên sâu.',
    },
    experienceBullets: {
      type: SchemaType.ARRAY,
      description:
        'Mảng chứa đúng 3 dòng mô tả hành động kinh nghiệm làm việc bằng TIẾNG VIỆT, hướng theo format chuẩn CV (Hành động logic + Công nghệ áp dụng + Kết quả đạt được hoặc số liệu metric giả định ấn tượng).',
      items: {
        type: SchemaType.STRING,
      },
    },
    projects: {
      type: SchemaType.ARRAY,
      description:
        'Mảng chứa đúng 1 đối tượng dự án kỹ thuật trọng tâm liên quan trực tiếp đến vị trí ứng tuyển.',
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: {
            type: SchemaType.STRING,
            description:
              'Tên dự án kỹ thuật viết bằng TIẾNG VIỆT kèm tên tiếng Anh nếu có (Ví dụ: HỆ THỐNG QUẢN LÝ TUYỂN DỤNG TRỢ NĂNG - EQUITAS AI).',
          },
          tech: {
            type: SchemaType.STRING,
            description:
              'Chuỗi danh sách các công nghệ cốt lõi áp dụng trong dự án, phân tách bằng dấu phẩy (Ví dụ: Next.js, NestJS, Prisma, PostgreSQL, Docker).',
          },
          desc: {
            type: SchemaType.STRING,
            description:
              'Mô tả ngắn gọn, súc tích bằng TIẾNG VIỆT về bài toán dự án giải quyết, các tính năng nâng cao đã hiện thực hóa (Xác thực, tối ưu DB...) và giá trị thực tế của nó.',
          },
        },
        required: ['name', 'tech', 'desc'],
      },
    },
    skills: {
      type: SchemaType.ARRAY,
      description:
        'Danh sách 3 kỹ năng chuyên môn kỹ thuật cốt lõi phù hợp nhất với yêu cầu tin tuyển dụng.',
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: {
            type: SchemaType.STRING,
            description:
              'Tên công nghệ hoặc kỹ năng mềm bổ trợ (Ví dụ: Node.js / NestJS, Cơ sở dữ liệu PostgreSQL).',
          },
          level: {
            type: SchemaType.INTEGER,
            description:
              'Mức độ thành thạo, ép giá trị là số nguyên chia hết cho 5 trong khoảng từ 75 đến 95 (Ví dụ: 80, 85, 90).',
          },
        },
        required: ['name', 'level'],
      },
    },
    certifications: {
      type: SchemaType.ARRAY,
      description:
        'Mảng chứa 2 chứng chỉ hoặc mục tiêu học thuật bằng TIẾNG VIỆT phù hợp để gia tăng độ uy tín cho CV.',
      items: {
        type: SchemaType.STRING,
      },
    },
    awards: {
      type: SchemaType.ARRAY,
      description:
        'Mảng chứa 2 danh hiệu, giải thưởng hoặc học bổng để làm nổi bật năng lực xuất sắc của ứng viên.',
      items: {
        type: SchemaType.STRING,
      },
    },
  },
  required: [
    'jobTitle',
    'summary',
    'experienceBullets',
    'projects',
    'skills',
    'certifications',
    'awards',
  ],
};
