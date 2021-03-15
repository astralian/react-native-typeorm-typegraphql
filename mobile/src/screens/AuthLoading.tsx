import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';

export default function AuthLoadingScreen(props) {
    useEffect(() => {
        bootstrapAsync();
    });

    const bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('token');

        props.navigation.replace(userToken ? 'Profile' : 'Login');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator />
            <StatusBar barStyle="default" />
        </View>
    );
}
