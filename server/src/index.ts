import path from 'path';
import express from 'express';
import session from 'express-session';
import 'reflect-metadata';
import connectSqlite3 from 'connect-sqlite3';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import { createConnection, getConnectionOptions } from 'typeorm';
import { PlaceResolver } from './resolvers/PlaceResolver';
import { AuthResolver } from './resolvers/AuthResolver';

const SQLiteStore = connectSqlite3(session);

async function bootstrap() {
    const app = express();

    app.use(
        session({
            name: 'qid',
            store: new SQLiteStore({
                db: 'database.sqlite',
                concurrentDB: true
            }),
            secret: process.env.SESSION_SECRET || 'secret',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 7 * 365
            }
        })
    );

    const dbOptions = await getConnectionOptions(process.env.NODE_ENV || 'development');

    createConnection({ ...dbOptions, name: 'default' })
        .then(async () => {
            const schema = await buildSchema({
                resolvers: [PlaceResolver, AuthResolver],
                validate: true,
                emitSchemaFile: path.resolve(__dirname, 'schema.gql')
            });

            const apolloServer = new ApolloServer({
                schema,
                context: ({ req, res }) => ({ req, res }),
                introspection: true,
                playground: true
            });

            apolloServer.applyMiddleware({ app, cors: true });

            const port = process.env.PORT || 4000;

            app.listen(port, () => {
                console.log(`Server started at http://localhost:${port}/graphql`);
            });
        })
        .catch((error) => console.log(error));
}

bootstrap();
