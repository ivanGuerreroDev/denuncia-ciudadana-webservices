import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { UserOutput } from '../../user/dtos/user-output.dto';
import { AccusationDataOutput } from './accusation-data-output.dto';
import { AccusationTypeOutput } from './accusation-type-output.dto';

export class AccusationOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  createdDate: Date;

  @Expose()
  @Type(() => AccusationTypeOutput)
  @ApiProperty()
  accusationType: AccusationTypeOutput;

  @Expose()
  @Type(() => UserOutput)
  @ApiProperty()
  user: UserOutput;

  @Expose()
  @Type(() => AccusationDataOutput)
  @ApiProperty({ type: [AccusationDataOutput] })
  accusationData: AccusationDataOutput[];
}
