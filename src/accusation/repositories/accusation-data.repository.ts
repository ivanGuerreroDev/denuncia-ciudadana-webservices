import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AccusationData } from '../entities/accusation-data.entity';

@Injectable()
export class AccusationDataRepository extends Repository<AccusationData> {
  constructor(private dataSource: DataSource) {
    super(AccusationData, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<AccusationData> {
    const accusationData = await this.findOne({ where: { id } });
    if (!accusationData) {
      throw new NotFoundException();
    }

    return accusationData;
  }
}
