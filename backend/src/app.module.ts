import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllersModule } from './controllers/controllers.module';
import { DatabaseModule } from './database/database.module';
import { SeedService } from './database/seed.service';

@Module({
  imports: [ControllersModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
