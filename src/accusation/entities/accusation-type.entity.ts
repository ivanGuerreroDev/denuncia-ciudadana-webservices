import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Accusation } from './accusation.entity';

@Entity('accusation_types')
export class AccusationType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => Accusation, (accusation) => accusation.accusationType)
  accusations: Accusation[];
}
