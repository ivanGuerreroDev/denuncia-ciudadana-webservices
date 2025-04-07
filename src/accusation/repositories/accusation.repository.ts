import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Accusation } from '../entities/accusation.entity';

@Injectable()
export class AccusationRepository extends Repository<Accusation> {
  constructor(private dataSource: DataSource) {
    super(Accusation, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<Accusation> {
    const accusation = await this.findOne({ 
      where: { id },
      relations: ['accusationData']
    });
    if (!accusation) {
      throw new NotFoundException();
    }

    return accusation;
  }
}
