import { IdeaService } from './idea.service';
import { Query, Resolver, Args, ResolveProperty, Parent } from '@nestjs/graphql';
import { CommentService } from 'src/comment/comment.service';

@Resolver('Idea')
export class IdeaResolver {
  constructor(
    private ideaService: IdeaService,
    private commentService: CommentService,
  ) {}

  @Query()
  ideas(@Args('pages') pages: number, @Args('newest') newest: boolean) {
    return this.ideaService.showAll(pages, newest);
  }

  @ResolveProperty()
  comments(@Parent() idea) {
      const { id } = idea;
      return this.commentService.showByIdea(id);
  }
}
