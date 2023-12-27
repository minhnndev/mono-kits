import { DeviceEventEmitter, Platform } from 'react-native';

const PADDING_IMAGE_BACKGROUND = 58; // Platform.OS === 'android' ? 62 : 66;// 58

const getDefaultHeaderHeight = () => {
    let headerHeight;

    if (Platform.OS === 'ios') {
        headerHeight = 44;
    } else if (Platform.OS === 'android') {
        headerHeight = 56;
    } else {
        headerHeight = 64;
    }

    return headerHeight;
};

const goBackSafe = ({ navigation, route, onPressLeftHeader }) => {
    const { params = {} } = route || {};
    const rootNavigation = params?.navigation;
    const rootState = rootNavigation?.dangerouslyGetState?.() || {};
    const { routes: rootRoute = [] } = rootState;
    const state = navigation?.dangerouslyGetState?.() || {};
    const { routes = [] } = state;
    const goBack = () => {
        if (routes.length > 1 && navigation?.canGoBack?.()) {
            navigation.goBack();
        } else if (rootNavigation && (rootNavigation?.goBack && typeof rootNavigation?.goBack === 'function')) {
            rootNavigation?.goBack?.();
        } else {
            const currentTime = new Date().getTime();
            const requestId = `navigationBackPress#${currentTime}`;
            DeviceEventEmitter.emit('dismiss', { requestId });
        }
    };
    if (onPressLeftHeader && typeof onPressLeftHeader === 'function') return onPressLeftHeader({ goBack });
    return goBack();
};

module.exports = {
    goBackSafe, getDefaultHeaderHeight, PADDING_IMAGE_BACKGROUND
};
