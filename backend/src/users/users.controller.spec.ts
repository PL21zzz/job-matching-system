import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

// Giả lập UsersService
const mockUsersService = {
  getProfileMe: jest.fn(),
  updateProfile: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfileMe', () => {
    it('should call service.getProfileMe with correct params', async () => {
      const mockReq = { user: { sub: 'user-1', role: 'Candidate' } };
      mockUsersService.getProfileMe.mockResolvedValue({ id: 'user-1' });

      const result = await controller.getProfileMe(mockReq);

      expect(result).toEqual({ id: 'user-1' });
      expect(service.getProfileMe).toHaveBeenCalledWith('user-1', 'Candidate');
    });

    it('should throw BadRequestException if req.user data is missing', async () => {
      const mockReq = { user: {} }; // Thiếu sub và role

      await expect(controller.getProfileMe(mockReq)).rejects.toThrow(
        new BadRequestException(
          'Token không hợp lệ hoặc thiếu thông tin vai trò.',
        ),
      );
    });
  });

  describe('editProfile', () => {
    it('should call service.updateProfile for Candidate when valid data provided', async () => {
      const mockReq = { user: { sub: 'user-1', role: 'Candidate' } };
      const body = { fullName: 'Phong Test', phone: '0905', address: 'DN' };
      mockUsersService.updateProfile.mockResolvedValue({ success: true });

      const result = await controller.editProfile(mockReq, body);

      expect(result).toEqual({ success: true });
      expect(service.updateProfile).toHaveBeenCalledWith(
        'user-1',
        'Candidate',
        expect.any(Object),
      );
    });

    it('should throw BadRequestException if req.user info is empty on patch', async () => {
      const mockReq = {};
      await expect(controller.editProfile(mockReq, {})).rejects.toThrow(
        new BadRequestException(
          'Token không hợp lệ hoặc thiếu thông tin vai trò.',
        ),
      );
    });

    it('should throw BadRequestException if role account is invalid', async () => {
      const mockReq = { user: { sub: 'user-1', role: 'ADMIN_TEST' } };
      await expect(controller.editProfile(mockReq, {})).rejects.toThrow(
        new BadRequestException('Vai trò tài khoản không hợp lệ.'),
      );
    });
  });
});
