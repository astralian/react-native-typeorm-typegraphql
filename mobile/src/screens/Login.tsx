import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRegisterMutation, useLoginMutation } from '../../graphql';
import { Button, TextInput, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function LoginScreen(props) {
    const theme = useTheme();
    const { navigation } = props;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [login, setLogin] = useState(false);

    const [signUpMutation] = useRegisterMutation({
        async onCompleted({ register }) {
            const { token } = register;

            if (token) {
                try {
                    await AsyncStorage.setItem('token', token);
                    navigation.replace('Profile');
                } catch (err) {
                    console.log(err.message);
                }
            }
        }
    });

    const [signInMutation] = useLoginMutation({
        async onCompleted({ login }) {
            const { token } = login;
            if (token) {
                try {
                    await AsyncStorage.setItem('token', token);
                    navigation.replace('Profile');
                } catch (err) {
                    console.log(err.message);
                }
            }
        }
    });

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
            {login ? null : (
                <TextInput
                    onChangeText={(text) => setUsername(text)}
                    value={username}
                    placeholder="Username"
                    label="Username"
                    mode="outlined"
                    autoCorrect={false}
                    autoCapitalize="none"
                    style={styles.input}
                />
            )}
            <TextInput
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder={login ? 'Email or Username' : 'Email'}
                label={login ? 'Email or Username' : 'Email'}
                mode="outlined"
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.input}
            />
            <TextInput
                onChangeText={(text) => setPassword(text)}
                value={password}
                placeholder="Password"
                label="Password"
                mode="outlined"
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.input}
                secureTextEntry
            />
            <View style={styles.buttonContainer}>
                <Button
                    labelStyle={{ color: theme.colors.text }}
                    style={{
                        backgroundColor: theme.colors.accent,
                        marginTop: 20
                    }}
                    onPress={() => {
                        if (login) {
                            const isEmail = email.includes('@');

                            isEmail
                                ? signInMutation({
                                      variables: { email, password }
                                  })
                                : signInMutation({
                                      variables: { username: email, password }
                                  });
                        } else {
                            signUpMutation({ variables: { email, username, password } });
                        }
                    }}
                >
                    {login ? 'Login' : 'Sign Up'}
                </Button>
                <Button
                    style={{ marginTop: 20 }}
                    onPress={() => {
                        setLogin(!login);
                    }}
                    icon="information"
                >
                    {login ? 'Need an account? Sign Up' : 'Have an account? Login'}
                </Button>
            </View>
        </ScrollView>
    );
}

LoginScreen.navigationOptions = {
    title: 'Welcome'
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 20
    },
    input: {
        width: width - 40,
        height: 60,
        marginTop: 5
    },
    buttonContainer: {
        width: '100%'
    }
});
