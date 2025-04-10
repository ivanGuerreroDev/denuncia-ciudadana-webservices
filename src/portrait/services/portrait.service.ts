import { BadRequestException,Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

import { PortraitInputDto } from '../dtos/portrait-input.dto';
import { PortraitOutputDto } from '../dtos/portrait-output.dto';

@Injectable()
export class PortraitService {
  private readonly logger = new Logger(PortraitService.name);
  private readonly openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generatePortrait(portraitData: PortraitInputDto): Promise<PortraitOutputDto> {
    try {
      const prompt = this.buildPrompt(portraitData);
      
      this.logger.log(`Generando retrato con prompt: ${prompt}`);
      
      const response = await this.openai.images.generate({
        model: "dall-e-3", // o "dall-e-2" dependiendo de la calidad requerida
        prompt: prompt,
        n: 1,
        size: "1024x1024", // Tamaño estándar
        quality: "standard",
        response_format: "url",
      });

      const imageUrl = response.data[0].url;
      if (!imageUrl) {
        throw new BadRequestException('No se pudo generar la imagen');
      }

      return {
        imageUrl,
        prompt,
        createdAt: new Date(),
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error al generar retrato hablado: ${error.message}`, error.stack);
      } else {
        this.logger.error('Error al generar retrato hablado: Error desconocido');
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al generar el retrato hablado');
    }
  }

  private buildPrompt(data: PortraitInputDto): string {
    // Construir un prompt detallado para DALL-E basado en la información recibida
    let prompt = `Retrato fotorrealista de ${data.genero} de aproximadamente ${data.edad} años. `;
    
    // Rasgos faciales básicos
    prompt += `Rostro de forma ${data.formaRostro}, `;
    prompt += `con ojos ${data.ojos}, `;
    
    // Cabello
    prompt += `cabello ${data.colorCabello} `;
    if (data.longitudCabello) prompt += `${data.longitudCabello} `;
    if (data.estiloCabello) prompt += `de estilo ${data.estiloCabello} `;
    
    // Piel
    prompt += `con piel ${data.colorPiel}. `;
    
    // Detalles opcionales
    if (data.nariz) prompt += `Nariz ${data.nariz}. `;
    if (data.boca) prompt += `Boca ${data.boca}. `;
    if (data.orejas) prompt += `Orejas ${data.orejas}. `;
    if (data.marcasPiel) prompt += `Con marcas en la piel como ${data.marcasPiel}. `;
    if (data.texturaPiel) prompt += `Textura de piel ${data.texturaPiel}. `;
    if (data.velloFacial) prompt += `Vello facial: ${data.velloFacial}. `;
    if (data.expresionFacial) prompt += `Expresión facial ${data.expresionFacial}. `;
    if (data.accesorios) prompt += `Usando ${data.accesorios}. `;
    if (data.contextoVestimenta) prompt += `Vestimenta ${data.contextoVestimenta}. `;
    if (data.caracteristicasEspeciales) prompt += `Características distintivas: ${data.caracteristicasEspeciales}. `;
    
    // Indicaciones para mejorar el retrato hablado
    prompt += "Retrato hablado de alta calidad, estilo policial, fondo neutro, iluminación frontal uniforme, detalles faciales claros, fotografía tipo documento de identidad.";
    
    return prompt;
  }
}
