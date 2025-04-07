import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AccusationTypeOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;
}
