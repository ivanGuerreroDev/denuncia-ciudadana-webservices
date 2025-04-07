import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ type: 'number' })
  @IsNotEmpty()
  @IsNumber()
  accusationId: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
