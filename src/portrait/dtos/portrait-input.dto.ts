import { IsOptional, IsString } from 'class-validator';

export class PortraitInputDto {
  @IsString()
  genero: string;

  @IsString()
  formaRostro: string;

  @IsString()
  ojos: string;

  @IsString()
  @IsOptional()
  nariz?: string;

  @IsString()
  @IsOptional()
  boca?: string;

  @IsString()
  @IsOptional()
  orejas?: string;

  @IsString()
  colorCabello: string;

  @IsString()
  @IsOptional()
  longitudCabello?: string;

  @IsString()
  @IsOptional()
  estiloCabello?: string;

  @IsString()
  @IsOptional()
  distribucionCabello?: string;

  @IsString()
  colorPiel: string;

  @IsString()
  @IsOptional()
  marcasPiel?: string;

  @IsString()
  @IsOptional()
  texturaPiel?: string;

  @IsString()
  @IsOptional()
  accesorios?: string;

  @IsString()
  @IsOptional()
  velloFacial?: string;

  @IsString()
  @IsOptional()
  expresionFacial?: string;

  @IsString()
  edad: string;

  @IsString()
  @IsOptional()
  contextoVestimenta?: string;

  @IsString()
  @IsOptional()
  caracteristicasEspeciales?: string;
}
