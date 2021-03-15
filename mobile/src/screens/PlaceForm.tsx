import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useCreatePlaceMutation, useUpdatePlaceMutation, useDeletePlaceMutation } from '../../graphql';
import { Button, TextInput, useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function LoginScreen(props) {
    const theme = useTheme();
    const route = useRoute();
    const { navigation } = props;
    const { item } = route.params as any;
    const [title, setTitle] = useState(item.title || '');
    const [description, setDescription] = useState(item.description || '');
    const [imageUrl, setImageUrl] = useState(item.imageUrl || '');

    // Create Place
    const [createPlaceMutation] = useCreatePlaceMutation({
        async onCompleted({ createPlace }) {
            navigation.goBack();
        }
    });

    const [updatePlaceMutation] = useUpdatePlaceMutation({
        async onCompleted({ updatePlace }) {
            navigation.navigate('Detail', { item: updatePlace });
        }
    });

    const [deletePlaceMutation] = useDeletePlaceMutation({
        async onCompleted() {
            navigation.navigate('Profile');
        }
    });

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
            <TextInput
                onChangeText={(text) => setTitle(text)}
                value={title}
                placeholder="Title"
                label="Title"
                mode="outlined"
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.input}
            />
            <TextInput
                onChangeText={(text) => setDescription(text)}
                value={description}
                placeholder="Description"
                label="Description"
                mode="outlined"
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.input}
            />
            <TextInput
                onChangeText={(text) => setImageUrl(text)}
                value={imageUrl}
                placeholder="Image URL"
                label="Image URL"
                mode="outlined"
                autoCorrect={false}
                autoCapitalize="none"
                style={styles.input}
            />
            <View style={styles.buttonContainer}>
                <Button
                    labelStyle={{ color: theme.colors.text }}
                    style={{
                        backgroundColor: theme.colors.accent,
                        marginTop: 20
                    }}
                    onPress={() =>
                        item.id
                            ? updatePlaceMutation({
                                  variables: {
                                      id: parseInt(item.id),
                                      title,
                                      description,
                                      imageUrl
                                  }
                              })
                            : createPlaceMutation({
                                  variables: { title, description, imageUrl }
                              })
                    }
                >
                    Save Place
                </Button>
                <Button
                    labelStyle={{ color: theme.colors.text }}
                    style={{
                        backgroundColor: theme.colors.accent,
                        marginTop: 20
                    }}
                    onPress={() => deletePlaceMutation({ variables: { id: parseInt(item.id) } })}
                >
                    Delete Place
                </Button>
            </View>
        </ScrollView>
    );
}

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
