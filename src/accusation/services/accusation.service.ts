import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { CreateAccusationInput, UpdateAccusationInput } from '../dtos/accusation-input.dto';
import { AccusationOutput } from '../dtos/accusation-output.dto';
import { Accusation } from '../entities/accusation.entity';
import { AccusationData } from '../entities/accusation-data.entity';
import { AccusationRepository } from '../repositories/accusation.repository';
import { AccusationDataRepository } from '../repositories/accusation-data.repository';
import { AccusationTypeRepository } from '../repositories/accusation-type.repository';

@Injectable()
export class AccusationService {
  constructor(
    private repository: AccusationRepository,
    private accusationTypeRepository: AccusationTypeRepository,
    private accusationDataRepository: AccusationDataRepository,
    private userService: UserService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AccusationService.name);
  }

  async createAccusation(
    ctx: RequestContext,
    input: CreateAccusationInput,
  ): Promise<AccusationOutput> {
    this.logger.log(ctx, `${this.createAccusation.name} was called`);

    const accusation = new Accusation();
    
    // Get accusation type
    const accusationType = await this.accusationTypeRepository.getById(input.accusationTypeId);
    accusation.accusationType = accusationType;

    // Set user
    if (!ctx.user) {
      throw new UnauthorizedException('User not authenticated');
    }
    const user = await this.userService.getUserById(ctx, ctx.user.id);
    accusation.user = plainToClass(User, user);

    // Save accusation first to get ID
    await this.repository.save(accusation);

    // Create accusation data entries
    if (input.accusationData && input.accusationData.length > 0) {
      const accusationDataEntries = input.accusationData.map(dataInput => {
        const accusationData = new AccusationData();
        accusationData.key = dataInput.key;
        accusationData.value = dataInput.value;
        accusationData.accusation = accusation;
        return accusationData;
      });

      await this.accusationDataRepository.save(accusationDataEntries);
    }

    // Get complete accusation with relations
    const savedAccusation = await this.repository.getById(accusation.id);

    return plainToClass(AccusationOutput, savedAccusation, {
      excludeExtraneousValues: true,
    });
  }

  async getAccusations(
    ctx: RequestContext,
  ): Promise<AccusationOutput[]> {
    this.logger.log(ctx, `${this.getAccusations.name} was called`);

    const accusations = await this.repository.find({
      relations: ['accusationType', 'user', 'accusationData'],
    });

    return accusations.map(accusation =>
      plainToClass(AccusationOutput, accusation, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async getAccusationById(
    ctx: RequestContext,
    id: number,
  ): Promise<AccusationOutput> {
    this.logger.log(ctx, `${this.getAccusationById.name} was called`);

    const accusation = await this.repository.getById(id);

    return plainToClass(AccusationOutput, accusation, {
      excludeExtraneousValues: true,
    });
  }

  async getUserAccusations(
    ctx: RequestContext,
    userId: number,
  ): Promise<AccusationOutput[]> {
    this.logger.log(ctx, `${this.getUserAccusations.name} was called`);

    const accusations = await this.repository.find({
      where: { user: { id: userId } },
      relations: ['accusationType', 'user', 'accusationData'],
    });

    return accusations.map(accusation =>
      plainToClass(AccusationOutput, accusation, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async updateAccusation(
    ctx: RequestContext,
    id: number,
    input: UpdateAccusationInput,
  ): Promise<AccusationOutput> {
    this.logger.log(ctx, `${this.updateAccusation.name} was called`);

    // Get existing accusation
    const accusation = await this.repository.getById(id);

    // Check if user is authorized (only the creator can update)
    if (!ctx.user || accusation.user.id !== ctx.user.id) {
      throw new UnauthorizedException('You are not authorized to update this accusation');
    }

    // Update accusation type if provided
    if (input.accusationTypeId) {
      const accusationType = await this.accusationTypeRepository.getById(input.accusationTypeId);
      accusation.accusationType = accusationType;
      await this.repository.save(accusation);
    }

    // Update accusation data if provided
    if (input.accusationData && input.accusationData.length > 0) {
      // Delete existing data
      await this.accusationDataRepository.delete({ accusation: { id } });

      // Create new data entries
      const accusationDataEntries = input.accusationData.map(dataInput => {
        const accusationData = new AccusationData();
        accusationData.key = dataInput.key;
        accusationData.value = dataInput.value;
        accusationData.accusation = accusation;
        return accusationData;
      });

      await this.accusationDataRepository.save(accusationDataEntries);
    }

    // Get updated accusation with relations
    const updatedAccusation = await this.repository.getById(id);

    return plainToClass(AccusationOutput, updatedAccusation, {
      excludeExtraneousValues: true,
    });
  }
}
