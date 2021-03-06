import bcrypt from 'bcrypt';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../entity/User';
import { AuthInput } from '../graphql-types/AuthInput';
import { UserResponse } from '../graphql-types/UserResponse';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { getUserId } from '../utils';

const invalidLoginResponse = {
    errors: [
        {
            path: 'email',
            message: 'invalid login'
        }
    ]
};

@Resolver()
export class AuthResolver {
    @Mutation(() => UserResponse)
    async register(@Arg('input') { email, username, password }: AuthInput): Promise<UserResponse> {
        if (email) {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return {
                    errors: [
                        {
                            path: 'email',
                            message: 'already exist'
                        }
                    ]
                };
            }
        }

        if (username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return {
                    errors: [
                        {
                            path: 'username',
                            message: 'already in use'
                        }
                    ]
                };
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            email,
            username,
            password: hashedPassword
        }).save();

        const payload = {
            is: user.id,
            username: user.username,
            email: user.email
        };

        const token = jwt.sign(payload, process.env.SESSION_SECRET || 'secret');

        return { user, token };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('input') { username, email, password }: AuthInput,
        @Ctx() ctx: { req: Request; res: Response }
    ): Promise<UserResponse> {
        if (username || email) {
            const user = username ? await User.findOne({ where: { username } }) : await User.findOne({ where: { email } });

            if (!user) {
                return invalidLoginResponse;
            }

            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                return invalidLoginResponse;
            }

            const payload = {
                id: user.id,
                username: user.username,
                email: user.email
            };

            ctx.req.session!['userId'] = user.id;

            const token = jwt.sign(payload, process.env.SESSION_SECRET || 'secret');

            return { user, token };
        }

        return invalidLoginResponse;
    }

    @Query(() => User)
    async currentUser(@Ctx() ctx: { req: Request; res: Response }): Promise<User | undefined> {
        const userId = getUserId(ctx);

        if (userId) {
            return await User.findOne(userId);
        }

        throw new Error('User not found');
    }
}
