import { Module } from '@nestjs/common';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaEntity } from './idea.entity';
import { UserEntity } from 'src/user/user.entity';
import { IdeaResolver } from './idea.resolver';
import { CommentEntity } from 'src/comment/comment.entity';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaEntity, CommentEntity, UserEntity]), CommentModule],
  controllers: [IdeaController],
  providers: [IdeaService, IdeaResolver],
})
export class IdeaModule {}
