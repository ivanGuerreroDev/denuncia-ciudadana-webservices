import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { multerConfig } from '../shared/configs/multer.config';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { AccusationController } from './controllers/accusation.controller';
import { AccusationTypeController } from './controllers/accusation-type.controller';
import { FileUploadController } from './controllers/file-upload.controller';
import { Accusation } from './entities/accusation.entity';
import { AccusationData } from './entities/accusation-data.entity';
import { AccusationType } from './entities/accusation-type.entity';
import { AccusationRepository } from './repositories/accusation.repository';
import { AccusationDataRepository } from './repositories/accusation-data.repository';
import { AccusationTypeRepository } from './repositories/accusation-type.repository';
import { AccusationService } from './services/accusation.service';
import { AccusationTypeService } from './services/accusation-type.service';
import { FileUploadService } from './services/file-upload.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([Accusation, AccusationType, AccusationData]),
    UserModule,
    MulterModule.register(multerConfig),
  ],
  controllers: [
    AccusationController,
    AccusationTypeController,
    FileUploadController,
  ],
  providers: [
    AccusationService,
    AccusationTypeService,
    FileUploadService,
    JwtAuthStrategy,
    AccusationRepository,
    AccusationTypeRepository,
    AccusationDataRepository,
  ],
  exports: [AccusationService, AccusationTypeService],
})
export class AccusationModule {}
