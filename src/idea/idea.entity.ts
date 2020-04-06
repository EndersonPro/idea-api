import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

@Entity({ name: 'idea' })
export class IdeaEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @CreateDateColumn() created: Date;

  @UpdateDateColumn() updated: Date;

  @Column('text') idea: string;

  @Column('text') description: string;

  @ManyToOne(
    type => UserEntity,
    author => author.ideas,
  )
  author: UserEntity;
}
