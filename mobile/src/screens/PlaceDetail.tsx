import React, { FunctionComponent } from 'react';
import { SafeAreaView } from 'react-native';
import { Button } from 'react-native-paper';
import { CardView } from '../components';

interface Props {
    navigation;
    route;
}

const PlaceDetail: FunctionComponent<Props> = (props) => {
    const { route, navigation } = props;
    const { item } = route;

    return (
        <SafeAreaView>
            <CardView {...(item as any)} />
            <Button
                style={{
                    marginTop: 20
                }}
                onPress={() => {
                    navigation.navigate('Form', { item });
                }}
            >
                Edit Place
            </Button>
        </SafeAreaView>
    );
};

export default PlaceDetail;
