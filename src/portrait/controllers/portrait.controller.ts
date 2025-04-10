import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PortraitInputDto } from '../dtos/portrait-input.dto';
import { PortraitOutputDto } from '../dtos/portrait-output.dto';
import { PortraitService } from '../services/portrait.service';

@Controller('portrait')
export class PortraitController {
  private readonly logger = new Logger(PortraitController.name);

  constructor(private readonly portraitService: PortraitService) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generatePortrait(@Body() portraitData: PortraitInputDto): Promise<PortraitOutputDto> {
    this.logger.log(`Recibida solicitud para generar retrato hablado`);
    return this.portraitService.generatePortrait(portraitData);
  }
}
