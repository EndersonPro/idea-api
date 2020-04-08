import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserResolver } from './user.resolver';
import { CommentEntity } from 'src/comment/comment.entity';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CommentEntity]),
    CommentModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserResolver],
})
export class UserModule {}
