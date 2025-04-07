import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { AccusationData } from './accusation-data.entity';
import { AccusationType } from './accusation-type.entity';

@Entity('accusations')
export class Accusation {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_date' })
  createdDate: Date;

  @ManyToOne(() => AccusationType, (accusationType) => accusationType.accusations, {
    eager: true,
  })
  accusationType: AccusationType;

  @ManyToOne(() => User, {
    eager: true,
  })
  user: User;

  @OneToMany(() => AccusationData, (accusationData) => accusationData.accusation, {
    cascade: true,
  })
  accusationData: AccusationData[];
}
