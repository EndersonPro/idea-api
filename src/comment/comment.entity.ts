import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, JoinTable } from "typeorm";
import { UserEntity } from "src/user/user.entity";
import { IdeaEntity } from "src/idea/idea.entity";


@Entity({ name: 'comment'})
export class CommentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    created: Date;

    @Column('text')
    comment: string;

    @ManyToOne(type => UserEntity)
    @JoinTable()
    author: UserEntity;

    @ManyToOne(type => IdeaEntity, idea => idea.comments)
    idea: IdeaEntity;

}