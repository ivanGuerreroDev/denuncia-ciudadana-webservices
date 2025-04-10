import { Module } from '@nestjs/common';

import { AccusationModule } from './accusation/accusation.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import { PortraitModule } from './portrait/portrait.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SharedModule, 
    UserModule, 
    AuthModule, 
    ArticleModule, 
    AccusationModule,
    PortraitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
