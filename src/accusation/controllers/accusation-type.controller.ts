import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ROLE } from '../../auth/constants/role.constant';
import { Roles } from '../../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CreateAccusationTypeInput, UpdateAccusationTypeInput } from '../dtos/accusation-type-input.dto';
import { AccusationTypeOutput } from '../dtos/accusation-type-output.dto';
import { AccusationTypeService } from '../services/accusation-type.service';

@ApiTags('accusation-types')
@Controller('accusation-types')
export class AccusationTypeController {
  constructor(
    private readonly accusationTypeService: AccusationTypeService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AccusationTypeController.name);
  }

  @Post()
  @ApiOperation({
    summary: 'Create accusation type API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(AccusationTypeOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async createAccusationType(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreateAccusationTypeInput,
  ): Promise<BaseApiResponse<AccusationTypeOutput>> {
    this.logger.log(ctx, `${this.createAccusationType.name} was called`);

    const accusationType = await this.accusationTypeService.createAccusationType(ctx, input);
    return { data: accusationType, meta: {} };
  }

  @Get()
  @ApiOperation({
    summary: 'Get accusation types as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([AccusationTypeOutput]),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAccusationTypes(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<AccusationTypeOutput[]>> {
    this.logger.log(ctx, `${this.getAccusationTypes.name} was called`);

    const accusationTypes = await this.accusationTypeService.getAccusationTypes(ctx);

    return { data: accusationTypes, meta: { count: accusationTypes.length } };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get accusation type by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AccusationTypeOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAccusationType(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<BaseApiResponse<AccusationTypeOutput>> {
    this.logger.log(ctx, `${this.getAccusationType.name} was called`);

    const accusationType = await this.accusationTypeService.getAccusationTypeById(ctx, id);
    return { data: accusationType, meta: {} };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update accusation type API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AccusationTypeOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async updateAccusationType(
    @ReqContext() ctx: RequestContext,
    @Param('id') accusationTypeId: number,
    @Body() input: UpdateAccusationTypeInput,
  ): Promise<BaseApiResponse<AccusationTypeOutput>> {
    this.logger.log(ctx, `${this.updateAccusationType.name} was called`);

    const accusationType = await this.accusationTypeService.updateAccusationType(
      ctx,
      accusationTypeId,
      input,
    );
    return { data: accusationType, meta: {} };
  }
}
