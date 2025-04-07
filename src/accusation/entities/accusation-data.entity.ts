import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Accusation } from './accusation.entity';

@Entity('accusation_data')
export class AccusationData {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Accusation, (accusation) => accusation.accusationData, {
    onDelete: 'CASCADE',
  })
  accusation: Accusation;

  @Column({ length: 100 })
  key: string;

  @Column({ type: 'text' })
  value: string;
}
