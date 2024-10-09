import { Module } from '@nestjs/common';
import { MonkeytypeService } from './monkeytype.service';
import { MonkeytypeController } from './monkeytype.controller';

@Module({
  controllers: [MonkeytypeController],
  providers: [MonkeytypeService],
})
export class MonkeytypeModule {}
