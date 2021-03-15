import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentOptions } from '@react-navigation/drawer';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';
import { DrawerContent } from './DrawerContent';
import { MainTabNavigator } from './MainTabNavigator';

const Drawer = createDrawerNavigator();

const AppNavigator = (navProps) => {
    const theme = useTheme();
    const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;

    return (
        <NavigationContainer theme={navigationTheme}>
            <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} toggleTheme={navProps.toggleTheme} />}>
                <Drawer.Screen name="Home" component={MainTabNavigator} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
