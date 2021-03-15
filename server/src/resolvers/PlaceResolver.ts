import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Place } from '../entity/Place';
import { PlaceInput } from '../graphql-types/PlaceInput';
import { plainToClass } from 'class-transformer';
import { getUserId } from '../utils';
import { Request } from 'express';
import { User } from '../entity/User';

@Resolver(() => Place)
export class PlaceResolver {
    @Query(() => Place, { nullable: true })
    async place(@Arg('id') id: number): Promise<Place | undefined> {
        return await Place.findOne(id, { relations: ['user'] });
    }

    @Query(() => [Place], {
        description: 'Get all places'
    })
    async places(): Promise<Place[]> {
        return await Place.find({ relations: ['user'] });
    }

    @Mutation(() => Place)
    async createPlace(@Arg('place') placeInput: PlaceInput, @Ctx() ctx: { req: Request }): Promise<Place> {
        const userId = getUserId(ctx);

        if (userId) {
            const place = plainToClass(Place, {
                description: placeInput.description,
                title: placeInput.title,
                imageUrl: placeInput.imageUrl,
                creationDate: new Date()
            });
            const user = await User.findOne(userId);

            return await Place.create({ ...place, user }).save();
        }

        throw new Error('User not found');
    }

    @Mutation(() => String)
    async deletePlace(@Arg('id') id: number, @Ctx() ctx: { req: Request }): Promise<Number | undefined> {
        const userId = getUserId(ctx);

        if (userId) {
            const deleted = await Place.delete({ id, user: { id: userId } });

            if (deleted) {
                return id;
            }

            throw new Error('Place not found');
        }

        throw new Error('User not found');
    }

    @Mutation(() => Place)
    async updatePlace(@Arg('place') placeInput: PlaceInput, @Ctx() ctx: { req: Request }): Promise<Place> {
        const userId = getUserId(ctx);

        if (userId) {
            const { id, title, description, imageUrl } = placeInput;
            const place = await Place.findOne({
                where: { id, user: { id: userId } },
                relations: ['user']
            });

            if (place) {
                place.title = title;
                place.description = description;
                place.imageUrl = imageUrl;
                await place.save();
                return place;
            }

            throw new Error('Place not found');
        }

        throw new Error('User not found');
    }
}
