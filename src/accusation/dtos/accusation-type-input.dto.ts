import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAccusationTypeInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateAccusationTypeInput {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string;
}
