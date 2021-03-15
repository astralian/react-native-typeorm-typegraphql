import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ErrorField {
    @Field()
    path: string;

    @Field()
    message: string;
}
