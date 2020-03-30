import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdeaEntity } from './idea.entity';
import { IdeaDTO } from './idea.dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity) private ideaReposity: Repository<IdeaEntity>,
  ) {}

  async showAll() {
    return this.ideaReposity.find();
  }

  async create(data: IdeaDTO) {
    const idea = await this.ideaReposity.create(data);
    await this.ideaReposity.save(idea);
    return idea;
  }

  async read(id: string) {
    return this.ideaReposity.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<IdeaDTO>) {
    await this.ideaReposity.update({ id }, data);
    return this.ideaReposity.findOne({ id });
  }

  async destroy(id: string) {
    await this.ideaReposity.delete({ id });
    return { delete: true };
  }
}
