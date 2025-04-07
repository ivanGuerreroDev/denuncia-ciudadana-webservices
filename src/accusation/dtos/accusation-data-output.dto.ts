import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AccusationDataOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  key: string;

  @Expose()
  @ApiProperty()
  value: string;
}
