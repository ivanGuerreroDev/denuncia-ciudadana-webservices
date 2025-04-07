import { Injectable } from '@nestjs/common';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AccusationData } from '../entities/accusation-data.entity';
import { AccusationRepository } from '../repositories/accusation.repository';
import { AccusationDataRepository } from '../repositories/accusation-data.repository';

@Injectable()
export class FileUploadService {
  constructor(
    private accusationRepository: AccusationRepository,
    private accusationDataRepository: AccusationDataRepository,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(FileUploadService.name);
  }

  async uploadFile(
    ctx: RequestContext,
    accusationId: number,
    file: Express.Multer.File,
  ): Promise<AccusationData> {
    this.logger.log(ctx, `${this.uploadFile.name} was called`);

    // Verificar que la acusación existe
    const accusation = await this.accusationRepository.getById(accusationId);

    // Crear un objeto con la información del archivo
    const attachmentInfo = {
      'attachment-type': file.mimetype,
      'url': `/uploads/${file.filename}`,
      'original-name': file.originalname,
      'size': file.size
    };

    // Crear el registro de datos de acusación
    const accusationData = new AccusationData();
    accusationData.key = 'attachment';
    accusationData.value = JSON.stringify(attachmentInfo);
    accusationData.accusation = accusation;

    // Guardar en la base de datos
    return this.accusationDataRepository.save(accusationData);
  }
}
