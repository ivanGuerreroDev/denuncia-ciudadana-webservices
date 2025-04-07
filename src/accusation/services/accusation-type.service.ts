import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { CreateAccusationTypeInput, UpdateAccusationTypeInput } from '../dtos/accusation-type-input.dto';
import { AccusationTypeOutput } from '../dtos/accusation-type-output.dto';
import { AccusationType } from '../entities/accusation-type.entity';
import { AccusationTypeRepository } from '../repositories/accusation-type.repository';

@Injectable()
export class AccusationTypeService {
  constructor(
    private repository: AccusationTypeRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AccusationTypeService.name);
  }

  async createAccusationType(
    ctx: RequestContext,
    input: CreateAccusationTypeInput,
  ): Promise<AccusationTypeOutput> {
    this.logger.log(ctx, `${this.createAccusationType.name} was called`);

    const accusationType = plainToClass(AccusationType, input);
    await this.repository.save(accusationType);

    return plainToClass(AccusationTypeOutput, accusationType, {
      excludeExtraneousValues: true,
    });
  }

  async getAccusationTypes(
    ctx: RequestContext,
  ): Promise<AccusationTypeOutput[]> {
    this.logger.log(ctx, `${this.getAccusationTypes.name} was called`);

    const accusationTypes = await this.repository.find();

    return accusationTypes.map(accusationType =>
      plainToClass(AccusationTypeOutput, accusationType, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async getAccusationTypeById(
    ctx: RequestContext,
    id: number,
  ): Promise<AccusationTypeOutput> {
    this.logger.log(ctx, `${this.getAccusationTypeById.name} was called`);

    const accusationType = await this.repository.getById(id);

    return plainToClass(AccusationTypeOutput, accusationType, {
      excludeExtraneousValues: true,
    });
  }

  async updateAccusationType(
    ctx: RequestContext,
    id: number,
    input: UpdateAccusationTypeInput,
  ): Promise<AccusationTypeOutput> {
    this.logger.log(ctx, `${this.updateAccusationType.name} was called`);

    const accusationType = await this.repository.getById(id);

    // Update fields if provided
    if (input.name) {
      accusationType.name = input.name;
    }

    await this.repository.save(accusationType);

    return plainToClass(AccusationTypeOutput, accusationType, {
      excludeExtraneousValues: true,
    });
  }
}
