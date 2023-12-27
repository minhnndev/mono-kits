import {DeviceEventEmitter, Platform} from 'react-native';

const PADDING_IMAGE_BACKGROUND = 58;

const getDefaultHeaderHeight = () => {
  return Platform.select({
    ios: 44,
    android: 56,
    default: 64,
  });
};

const goBackSafe = ({navigation, route, onPressLeftHeader}) => {
  const {params = {}} = route || {};
  const rootNavigation = params?.navigation;
  const state = navigation?.dangerouslyGetState?.() || {};
  const {routes = []} = state;
  const goBack = () => {
    if (routes.length > 1 && navigation?.canGoBack?.()) {
      navigation.goBack();
    } else if (rootNavigation?.canGoBack?.()) {
      rootNavigation?.goBack?.();
    }
    if (global?.miniAppApi?.dispatch) {
      let args = [{caller: 'kits'}];
      global?.miniAppApi?.dispatch?.('dismiss', ...args, undefined);
    } else {
      const currentTime = new Date().getTime();
      const requestId = `navigationBackPress#${currentTime}`;
      DeviceEventEmitter.emit('dismiss', {requestId});
    }
  };
  if (onPressLeftHeader && typeof onPressLeftHeader === 'function') {
    return onPressLeftHeader({goBack});
  }
  return goBack();
};

module.exports = {
  goBackSafe,
  getDefaultHeaderHeight,
  PADDING_IMAGE_BACKGROUND,
};
