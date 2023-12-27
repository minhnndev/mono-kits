import React from 'react';
import { useHeaderHeight } from '@react-navigation/stack';
import { useSafeArea } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { hooks, utils } from '../assets';
import Navigator from '../navigator/Navigator';

const ModalStack = ({ route, navigation, ...props }) => {
    const {
        params, navigator, ScreenComp, defaultOptions
    } = hooks.useNavigator({
        navigationStyle: 'modalHeader',
        StackClass: Navigator,
        route,
        navigation,
        ...props
    });

    const paddingTop = useHeaderHeight();

    const insets = useSafeArea();

    const headerHeight = utils.getDefaultHeaderHeight() + insets.top;

    if (defaultOptions?.headerTransparent) {
        return (
            <View style={{ paddingTop, flex: 1 }}>
                <ScreenComp params={params} navigator={navigator} />
            </View>
        );
    }

    return <ScreenComp params={params} navigator={navigator} headerHeight={headerHeight} />;
};

export default ModalStack;
