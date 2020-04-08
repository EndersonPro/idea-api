import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Mutation,
  Context,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { CommentService } from 'src/comment/comment.service';
import { UserDTO, UserRO } from './user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { throws } from 'assert';

@Resolver('User')
export class UserResolver {
  constructor(
    private userService: UserService,
    private commentService: CommentService,
  ) {}

  @Query()
  users(@Args('pages') pages: number) {
    return this.userService.showAllUsers(pages);
  }

  @Mutation()
  login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    const user: UserDTO = { username, password };
    console.log(user);
    return this.userService.login(user);
  }

  @Query()
  user(@Args() username: string) {
    return this.userService.read(username);
  }

  @Query()
  @UseGuards(new AuthGuard())
  whoami(@Context('user') user: UserRO) {
    const { username } = user;
    return this.userService.read(username);
  }

  @Mutation()
  register(@Args() { username, password }) {
    const user: UserDTO = { username, password };
    return this.userService.register(user);
  }

  @ResolveProperty()
  comments(@Parent() user) {
    const { id } = user;
    return this.commentService.showByUser(id);
  }
}
