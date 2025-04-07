import {
  Controller,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BaseApiResponse, SwaggerBaseApiResponse } from '../../shared/dtos/base-api-response.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AccusationDataOutput } from '../dtos/accusation-data-output.dto';
import { FileUploadService } from '../services/file-upload.service';

@ApiTags('accusations')
@Controller('accusations')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(FileUploadController.name);
  }

  @Post(':id/upload')
  @ApiOperation({
    summary: 'Upload file for accusation',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(AccusationDataOutput),
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @ReqContext() ctx: RequestContext,
    @Param('id', ParseIntPipe) accusationId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseApiResponse<AccusationDataOutput>> {
    this.logger.log(ctx, `${this.uploadFile.name} was called`);

    const accusationData = await this.fileUploadService.uploadFile(
      ctx,
      accusationId,
      file,
    );

    return {
      data: {
        id: accusationData.id,
        key: accusationData.key,
        value: accusationData.value,
      },
      meta: {},
    };
  }
}
