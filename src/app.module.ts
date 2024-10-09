import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonkeytypeModule } from './monkeytype/monkeytype.module';

@Module({
  imports: [MonkeytypeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
