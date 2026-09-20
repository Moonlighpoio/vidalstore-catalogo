import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatalogModule } from './catalog/catalog.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [CatalogModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}