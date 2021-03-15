import React, { useState } from 'react';
import { DarkTheme as PaperDarkTheme, DefaultTheme as PaperDefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { ApolloProvider } from '@apollo/react-hooks';
import { apolloClient } from './graphql';
import { AppNavigator } from './src/navigation';

const CombinedDefaultTheme = {
    ...PaperDefaultTheme,
    ...NavigationDefaultTheme
};

const CombinedDarkTheme = {
    ...PaperDarkTheme,
    ...NavigationDarkTheme,
    colors: { ...PaperDarkTheme.colors, ...NavigationDarkTheme.colors }
};

export default function App() {
    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme;

    function toggleTheme() {
        setIsDarkTheme((isDark) => !isDark);
    }

    return (
        <ApolloProvider client={apolloClient}>
            <PaperProvider theme={theme as any}>
                <AppNavigator toggleTheme={toggleTheme} />
            </PaperProvider>
        </ApolloProvider>
    );
}
