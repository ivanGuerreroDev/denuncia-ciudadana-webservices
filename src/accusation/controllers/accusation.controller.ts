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
import { CreateAccusationInput, UpdateAccusationInput } from '../dtos/accusation-input.dto';
import { AccusationOutput } from '../dtos/accusation-output.dto';
import { AccusationService } from '../services/accusation.service';

@ApiTags('accusations')
@Controller('accusations')
export class AccusationController {
  constructor(
    private readonly accusationService: AccusationService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AccusationController.name);
  }

  @Post()
  @ApiOperation({
    summary: 'Create accusation API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(AccusationOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createAccusation(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreateAccusationInput,
  ): Promise<BaseApiResponse<AccusationOutput>> {
    this.logger.log(ctx, `${this.createAccusation.name} was called`);

    const accusation = await this.accusationService.createAccusation(ctx, input);
    return { data: accusation, meta: {} };
  }

  @Get()
  @ApiOperation({
    summary: 'Get accusations as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([AccusationOutput]),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLE.ADMIN)
  async getAccusations(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<AccusationOutput[]>> {
    this.logger.log(ctx, `${this.getAccusations.name} was called`);

    const accusations = await this.accusationService.getAccusations(ctx);

    return { data: accusations, meta: { count: accusations.length } };
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get user accusations API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([AccusationOutput]),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getUserAccusations(
    @ReqContext() ctx: RequestContext,
  ): Promise<BaseApiResponse<AccusationOutput[]>> {
    this.logger.log(ctx, `${this.getUserAccusations.name} was called`);

    const accusations = await this.accusationService.getUserAccusations(ctx, ctx.user?.id ?? 0);

    return { data: accusations, meta: { count: accusations.length } };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get accusation by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AccusationOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAccusation(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<BaseApiResponse<AccusationOutput>> {
    this.logger.log(ctx, `${this.getAccusation.name} was called`);

    const accusation = await this.accusationService.getAccusationById(ctx, id);
    return { data: accusation, meta: {} };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update accusation API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AccusationOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateAccusation(
    @ReqContext() ctx: RequestContext,
    @Param('id') accusationId: number,
    @Body() input: UpdateAccusationInput,
  ): Promise<BaseApiResponse<AccusationOutput>> {
    this.logger.log(ctx, `${this.updateAccusation.name} was called`);

    const accusation = await this.accusationService.updateAccusation(
      ctx,
      accusationId,
      input,
    );
    return { data: accusation, meta: {} };
  }
}
