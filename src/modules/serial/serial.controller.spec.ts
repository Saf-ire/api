import { Test, TestingModule } from '@nestjs/testing';
import { SerialController } from './serial.controller';
import { SerialService } from './serial.service';

describe('SerialController', () => {
  let controller: SerialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SerialController],
      providers: [SerialService],
    }).compile();

    controller = module.get<SerialController>(SerialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
