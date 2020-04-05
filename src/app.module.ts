import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaModule } from './idea/idea.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';

const host = process.env.NODE_ENV === 'production' ? 'db' : 'localhost'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host,
      port: 5432,
      username: 'enderson_idea',
      password: 'api_idea',
      database: 'ideas',
      synchronize: true,
      logging: true,
      entities: ["./dist/**/*.entity.js"],
    }),
    IdeaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
