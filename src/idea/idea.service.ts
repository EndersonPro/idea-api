import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaEntity } from './idea.entity';
import { IdeaDTO, IdeaRO } from './idea.dto';
import { UserEntity } from 'src/user/user.entity';
import { Votes } from 'src/shared/votes.enum';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity) private ideaReposity: Repository<IdeaEntity>,
    @InjectRepository(UserEntity) private userReposity: Repository<UserEntity>,
  ) {}

  async showAll(): Promise<IdeaRO[]> {
    const ideas = await this.ideaReposity.find({
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    return ideas.map((idea: IdeaEntity) => this.toResponseObject(idea));
  }

  toResponseObject(idea: IdeaEntity): IdeaRO {
    const responseObject: any = {
      ...idea,
      author: idea.author.toResponseObject(false),
    };
    if (responseObject.upvotes) responseObject.upvotes = idea.upvotes.length;
    if (responseObject.downvotes)
      responseObject.downvotes = idea.downvotes.length;
    console.log(responseObject);
    return responseObject;
  }

  async create(userId: string, data: IdeaDTO): Promise<IdeaRO> {
    const user = await this.userReposity.findOne({ where: { id: userId } });
    const idea = await this.ideaReposity.create({ ...data, author: user });
    await this.ideaReposity.save(idea);
    return this.toResponseObject(idea);
  }

  async read(id: string): Promise<IdeaRO> {
    const idea = await this.ideaReposity.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(idea);
  }

  async update(
    id: string,
    userId: string,
    data: Partial<IdeaDTO>,
  ): Promise<IdeaRO> {
    let idea = await this.ideaReposity.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!idea) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    this.ensureOwnership(idea, userId);
    await this.ideaReposity.update({ id }, data);
    idea = await this.ideaReposity.findOne({
      where: { id },
      relations: ['author', 'comments'],
    });
    return this.toResponseObject(idea);
  }

  async destroy(id: string, userId: string): Promise<IdeaRO> {
    const idea = await this.ideaReposity.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!idea) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    this.ensureOwnership(idea, userId);
    await this.ideaReposity.delete({ id });
    return this.toResponseObject(idea);
  }

  async bookmark(id: string, userId: string) {
    const idea = await this.ideaReposity.findOne({ where: { id } });
    const user = await this.userReposity.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length < 1) {
      user.bookmarks.push(idea);
      await this.userReposity.save(user);
    } else {
      throw new HttpException(
        'Idea already bookmarked',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return user.toResponseObject(false);
  }

  async unbookmark(id: string, userId: string) {
    const idea = await this.ideaReposity.findOne({ where: { id } });
    const user = await this.userReposity.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length > 0) {
      user.bookmarks = user.bookmarks.filter(
        bookmark => bookmark.id !== idea.id,
      );
      await this.userReposity.save(user);
    } else {
      throw new HttpException(
        'Idea no already bookmarked',
        HttpStatus.BAD_GATEWAY,
      );
    }

    return user.toResponseObject(false);
  }

  private async vote(idea: IdeaEntity, user: UserEntity, vote: Votes) {
    const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
    if (
      idea[opposite].filter(voter => voter.id === user.id).length > 0 ||
      idea[vote].filter(voter => voter.id === user.id).length > 0
    ) {
      idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
      idea[vote] = idea[opposite].filter(voter => voter.id !== user.id);
      await this.ideaReposity.save(idea);
    } else if (idea[vote].filter(voter => voter.id === user.id).length < 1) {
      idea[vote].push(user);
      await this.ideaReposity.save(idea);
    } else {
      throw new HttpException('Unable to cast vote', HttpStatus.BAD_REQUEST);
    }
    return idea;
  }

  async upvote(id: string, userId: string) {
    let idea = await this.ideaReposity.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    const user = await this.userReposity.findOne({ where: { id: userId } });
    idea = await this.vote(idea, user, Votes.UP);
    return this.toResponseObject(idea);
  }

  async downvote(id: string, userId: string) {
    let idea = await this.ideaReposity.findOne({
      where: { id },
      relations: ['author', 'upvotes', 'downvotes', 'comments'],
    });
    const user = await this.userReposity.findOne({ where: { id: userId } });
    idea = await this.vote(idea, user, Votes.DOWN);
    return this.toResponseObject(idea);
  }

  ensureOwnership(idea: IdeaEntity, userId: string) {
    if (idea.author.id !== userId) {
      throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
    }
  }
}
