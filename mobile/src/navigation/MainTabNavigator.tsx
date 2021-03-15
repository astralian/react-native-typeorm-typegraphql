import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Places, PlaceDetail, Login, AuthLoadingScreen, Form } from '../screens';
import { useTheme, Portal, FAB } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { Header } from './Header';

export const ProfileStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Auth"
            headerMode="screen"
            screenOptions={{
                header: ({ scene, previous, navigation }) => <Header scene={scene} previous={previous} navigation={navigation} />
            }}
        >
            <Stack.Screen name="Auth" component={AuthLoadingScreen} />
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
    );
};
const Stack = createStackNavigator();

export const PlaceStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Places"
            headerMode="screen"
            screenOptions={{
                header: ({ scene, previous, navigation }) => <Header scene={scene} previous={previous} navigation={navigation} />
            }}
        >
            <Stack.Screen name="Places" component={Places} />
            <Stack.Screen name="Detail" component={PlaceDetail} />
            <Stack.Screen name="Form" component={Form} />
        </Stack.Navigator>
    );
};

const Tab = createMaterialBottomTabNavigator();

export const MainTabNavigator = ({ navigation }) => {
    const isFocused = useIsFocused();
    const theme = useTheme();
    return (
        <>
            <Tab.Navigator
                initialRouteName="Places"
                // shifting={true}
                sceneAnimationEnabled={false}
            >
                <Tab.Screen
                    name="Places"
                    component={PlaceStack}
                    options={{
                        tabBarIcon: 'home'
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileStack}
                    options={{
                        tabBarIcon: 'home-account'
                    }}
                />
            </Tab.Navigator>
            <Portal>
                <FAB
                    visible={isFocused}
                    icon="feather"
                    onPress={() => navigation.navigate('Form', { item: {} })}
                    style={{
                        backgroundColor: theme.colors.background,
                        position: 'absolute',
                        bottom: 100,
                        right: 16
                    }}
                />
            </Portal>
        </>
    );
};
