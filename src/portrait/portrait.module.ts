import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PortraitController } from './controllers/portrait.controller';
import { PortraitService } from './services/portrait.service';

@Module({
  imports: [ConfigModule],
  controllers: [PortraitController],
  providers: [PortraitService],
  exports: [PortraitService],
})
export class PortraitModule {}
