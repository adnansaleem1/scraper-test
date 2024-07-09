import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ScraperModule } from './scraper/scraper.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ ConfigModule.forRoot({
    isGlobal: true, 
  }),ScraperModule, AuthModule],
  providers: [AppService],
})
export class AppModule {}
