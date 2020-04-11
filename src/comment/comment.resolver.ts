import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { CommentDTO } from './comment.dto';

@Resolver()
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Query()
  comment(@Args('id') id: string) {
    return this.commentService.show(id);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  createComment(
    @Args('idea') idIdea: string,
    @Args('comment') comment: string,
    @Context('user') user,
  ) {
    const data: CommentDTO = { comment };
    const { id: userId } = user;
    return this.commentService.create(idIdea, userId, data);
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  deleteComment(@Args('id') idComment: string, @Context('user') user) {
    const { id: userId } = user;
    return this.commentService.destroy(idComment, userId);
  }
}
