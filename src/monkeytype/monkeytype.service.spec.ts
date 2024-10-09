import { Test, TestingModule } from '@nestjs/testing';
import { MonkeytypeService } from './monkeytype.service';

describe('MonkeytypeService', () => {
  let service: MonkeytypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonkeytypeService],
    }).compile();

    service = module.get<MonkeytypeService>(MonkeytypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
