import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class AccusationDataInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  value: string;
}

export class CreateAccusationInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  accusationTypeId: number;

  @ApiProperty({ type: [AccusationDataInput] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AccusationDataInput)
  accusationData: AccusationDataInput[];
}

export class UpdateAccusationInput {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  accusationTypeId: number;

  @ApiProperty({ type: [AccusationDataInput] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AccusationDataInput)
  accusationData: AccusationDataInput[];
}
