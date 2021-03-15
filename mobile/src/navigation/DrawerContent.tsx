import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Caption, Drawer, Paragraph, Text, Switch, Title, TouchableRipple, useTheme } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function DrawerContent(props) {
    const paperTheme = useTheme();
    const translateX = Animated.interpolate(props.progress, {
        inputRange: [0, 0.5, 0.7, 0.8, 1],
        outputRange: [-100, -85, -70, -45, 0]
    });

    return (
        <DrawerContentScrollView {...props}>
            <Animated.View
                style={[
                    styles.drawerContent,
                    {
                        backgroundColor: paperTheme.colors.surface,
                        transform: [{ translateX }]
                    }
                ]}
            >
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <TouchableOpacity
                            style={{ marginLeft: 10 }}
                            onPress={() => {
                                props.navigation.toggleDrawer();
                            }}
                        >
                            <MaterialCommunityIcons color={paperTheme.colors.text} name="account-outline" size={50} />
                        </TouchableOpacity>
                        <Title style={styles.title}>Guest</Title>
                        <Caption style={styles.caption}>@username</Caption>
                        <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>--</Paragraph>
                                <Caption style={styles.caption}>Following</Caption>
                            </View>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>--</Paragraph>
                                <Caption style={styles.caption}>Followers</Caption>
                            </View>
                        </View>
                    </View>

                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            label="Profile"
                            icon={({ color, size }) => <MaterialCommunityIcons name="account-outline" color={color} size={size} />}
                            onPress={() => {}}
                        />
                        <DrawerItem
                            label="Preferences"
                            icon={({ color, size }) => <MaterialCommunityIcons name="tune" color={color} size={size} />}
                            onPress={() => {}}
                        />
                        <DrawerItem
                            label="Bookmarks"
                            icon={({ color, size }) => <MaterialCommunityIcons name="bookmark-outline" color={color} size={size} />}
                            onPress={() => {}}
                        />
                    </Drawer.Section>
                    <Drawer.Section title="Preferences">
                        <TouchableRipple onPress={props.toggleTheme}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark} />
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section>
                </View>
            </Animated.View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1
    },
    userInfoSection: {
        paddingLeft: 20
    },
    title: {
        marginTop: 20,
        fontWeight: 'bold'
    },
    caption: {
        fontSize: 14,
        lineHeight: 14
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3
    },
    drawerSection: {
        marginTop: 15
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16
    }
});
