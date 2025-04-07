import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AccusationType } from '../entities/accusation-type.entity';

@Injectable()
export class AccusationTypeRepository extends Repository<AccusationType> {
  constructor(private dataSource: DataSource) {
    super(AccusationType, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<AccusationType> {
    const accusationType = await this.findOne({ where: { id } });
    if (!accusationType) {
      throw new NotFoundException();
    }

    return accusationType;
  }
}
