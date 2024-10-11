import { Test, TestingModule } from '@nestjs/testing';
import { DurationsController } from './durations.controller';
import { DurationsService } from './durations.service';

describe('DurationsController', () => {
  let controller: DurationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DurationsController],
      providers: [DurationsService],
    }).compile();

    controller = module.get<DurationsController>(DurationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
