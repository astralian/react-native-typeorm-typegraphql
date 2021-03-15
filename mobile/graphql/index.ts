import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, Observable, Operation } from 'apollo-link';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ZenObservable } from 'zen-observable-ts';

const link = new HttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include'
});

const request = async (operation: Operation) => {
    const token = await AsyncStorage.getItem('token');

    operation.setContext({
        headers: {
            authorization: token
        }
    });
};

const requestLink = new ApolloLink(
    (operation, forward) =>
        new Observable((observer) => {
            let handle: ZenObservable.Subscription;

            Promise.resolve(operation)
                .then((oper) => request(oper))
                .then(() => {
                    handle = forward(operation).subscribe({
                        next: observer.next.bind(observer),
                        error: observer.error.bind(observer),
                        complete: observer.complete.bind(observer)
                    });
                })
                .catch(observer.error.bind(observer));

            return () => {
                if (handle) {
                    handle.unsubscribe();
                }
            };
        })
);

export const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([requestLink, link])
});

export * from './graphql-hooks';
