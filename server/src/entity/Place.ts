import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@ObjectType({ description: 'Dest of place' })
@Entity()
export class Place extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    title: string;

    @Field({
        nullable: true,
        description: 'Place Description'
    })
    @Column()
    description?: string;

    @Field({
        nullable: true,
        description: 'URL'
    })
    @Column()
    imageUrl?: string;

    @Field({ nullable: true })
    @Column()
    creationDate?: Date;

    @Field({ nullable: true })
    @ManyToOne(() => User, (user) => user.places)
    user?: User;
}
