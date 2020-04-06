import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaEntity } from './idea.entity';
import { IdeaDTO, IdeaRO } from './idea.dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity) private ideaReposity: Repository<IdeaEntity>,
    @InjectRepository(UserEntity) private userReposity: Repository<UserEntity>,
  ) {}

  async showAll(): Promise<IdeaRO[]> {
    const ideas = await this.ideaReposity.find({ relations: ['author'] });
    return ideas.map((idea: IdeaEntity) => this.toResponseObject(idea));
  }

  toResponseObject(idea: IdeaEntity) {
    return { ...idea, author: idea.author.toResponseObject(false) };
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
      relations: ['author'],
    });
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(idea);
  }

  async update(id: string, userId: string, data: Partial<IdeaDTO>): Promise<IdeaRO> {
    let idea = await this.ideaReposity.findOne({ where: { id }, relations: ['author'] });
    if (!idea) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    this.ensureOwnership(idea, userId);
    await this.ideaReposity.update({ id }, data);
    idea = await this.ideaReposity.findOne({ id });
    return this.toResponseObject(idea);
  }

  async destroy(id: string, userId: string): Promise<IdeaRO> {
    const idea = await this.ideaReposity.findOne({ where: { id }, relations: ['author'] });
    if (!idea) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    this.ensureOwnership(idea, userId);
    await this.ideaReposity.delete({ id });
    return this.toResponseObject(idea);
  }


  ensureOwnership(idea: IdeaEntity, userId: string) {
      if (idea.author.id !== userId) {
          throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
      }
  }
}
