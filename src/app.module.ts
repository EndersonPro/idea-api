import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaModule } from './idea/idea.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { GraphQLModule } from '@nestjs/graphql';

const host: string = process.env.NODE_ENV === 'development' ? 'localhost' : 'db'; 
const entities: string[] = process.env.NODE_ENV === 'development' ? ["./dist/**/*.entity.js"] : ["./**/*.entity.js"];
@Module({
  imports: [
    GraphQLModule.forRoot({
        typePaths: ['./**/*.graphql'],
        context: ({ req }) => ({ headers: req.headers })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host,
      port: 5432,
      username: 'enderson_idea',
      password: 'api_idea',
      database: 'ideas',
      synchronize: true,
      dropSchema: false,
      logging: true,
      entities
    }),
    IdeaModule,
    UserModule,
    CommentModule,
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
