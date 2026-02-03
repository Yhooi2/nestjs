import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movie/movie.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from 'config/getTypeOrmConfig';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // forRoot()https://docs.nestjs.com/fundamentals/dynamic-modules Статическая конфигурация
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      // https://docs.nestjs.com/techniques/database Динамическая конфигурация из .env
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig, // https://docs.nestjs.com/fundamentals/custom-providers Создание провайдера через функцию фабрики

      inject: [ConfigService], // https://docs.nestjs.com/fundamentals/custom-providers Инъекция зависимостей в фабрику
    }),
    MoviesModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
