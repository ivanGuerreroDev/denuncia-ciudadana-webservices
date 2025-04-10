import {
  Controller,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { BaseApiResponse, SwaggerBaseApiResponse } from '../../shared/dtos/base-api-response.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AccusationDataOutput } from '../dtos/accusation-data-output.dto';
import { AccusationDataInput,UpdateAccusationInput } from '../dtos/accusation-input.dto';
import { AccusationService } from '../services/accusation.service';
import { FileUploadService } from '../services/file-upload.service';

@ApiTags('accusations')
@Controller('accusations')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly accusationService: AccusationService,
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
    const fileData: AccusationDataInput = {
      key: accusationData.key,
      value: accusationData.value,
    }
    const input:UpdateAccusationInput = {
      accusationTypeId: accusationData.accusation.accusationType.id,
      accusationData:[...accusationData.accusation.accusationData ,fileData]
    };
    await this.accusationService.updateAccusation(
      ctx,
      accusationId,
      input,
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
