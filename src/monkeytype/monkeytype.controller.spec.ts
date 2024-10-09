import { Test, TestingModule } from '@nestjs/testing';
import { MonkeytypeController } from './monkeytype.controller';
import { MonkeytypeService } from './monkeytype.service';

describe('MonkeytypeController', () => {
  let controller: MonkeytypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonkeytypeController],
      providers: [MonkeytypeService],
    }).compile();

    controller = module.get<MonkeytypeController>(MonkeytypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
