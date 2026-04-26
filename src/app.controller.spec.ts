import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { ConfigService } from '@nestjs/config';

const mockConfigService = {
  get: jest.fn(),
};

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getHello', () => {
    it('PUBG API URL 문자열을 반환해야 한다', () => {
      mockConfigService.get.mockReturnValueOnce('https://api.pubg.com');

      const result = appController.getHello();

      expect(result).toBe('PUBG API URL: https://api.pubg.com');
    });

    it('pubg.apiUrl 키로 ConfigService를 호출해야 한다', () => {
      mockConfigService.get.mockReturnValueOnce('https://api.pubg.com');

      appController.getHello();

      expect(mockConfigService.get).toHaveBeenCalledWith('pubg.apiUrl');
    });

    it('설정이 없을 때 undefined url을 반환해야 한다', () => {
      mockConfigService.get.mockReturnValueOnce(undefined);

      const result = appController.getHello();

      expect(result).toBe('PUBG API URL: undefined');
    });
  });
});
