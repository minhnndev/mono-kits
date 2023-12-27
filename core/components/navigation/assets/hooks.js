import {BackHandler, Platform} from 'react-native';
import {useCallback, useEffect, useRef} from 'react';
import themes from './themes';
import SwitchLanguage from '../../language/SwitchLanguage';
import utils from './utils';

const useFocusEffect = (effect, navigation) => {
  useEffect(() => {
    let isFocused = false;
    let cleanup;

    const callback = () => {
      const destroy = effect?.();

      if (destroy === undefined || typeof destroy === 'function') {
        return destroy;
      }
    };
    // We need to run the effect on intial render/dep changes if the screen is focused
    if (navigation?.isFocused?.()) {
      cleanup = callback?.();
      isFocused = true;
    }

    const unsubscribeFocus = navigation?.addListener?.('focus', () => {
      // If callback was already called for focus, avoid calling it again
      // The focus event may also fire on intial render, so we guard against runing the effect twice
      if (isFocused) {
        return;
      }

      if (cleanup !== undefined) {
        cleanup?.();
      }

      cleanup = callback?.();
      isFocused = true;
    });

    const unsubscribeBlur = navigation?.addListener?.('blur', () => {
      if (cleanup !== undefined) {
        cleanup?.();
      }

      cleanup = undefined;
      isFocused = false;
    });

    return () => {
      if (cleanup !== undefined) {
        cleanup?.();
      }

      unsubscribeFocus?.();
      unsubscribeBlur?.();
    };
  }, [effect, navigation]);
};

const useSingleton = (callBack = () => {}) => {
  const hasBeenCalled = useRef(false);
  const active = () => {
    callBack();
    hasBeenCalled.current = true;
  };
  !hasBeenCalled.current && active();
};

const useNavigator = ({
  route,
  navigation,
  stack,
  navigatorStyle = 'stackHeader',
  StackClass,
  ...props
}) => {
  const routeParams = route.params || {};
  const {params = {}} = routeParams;
  const ScreenComp = routeParams.screen;
  const options = {
    ...routeParams.options,
    title: SwitchLanguage.getLocalize(routeParams?.options?.title || ''),
  };
  if (options.headerLeft && options.headerLeft?.() != null) {
    delete options.headerLeft;
  }
  const defaultOptions = {
    ...themes[navigatorStyle]({route, navigation, ...props}),
    ...options,
  };
  const navigator = useRef({});
  const isActionBackPress = useRef(null);

  useSingleton(() => {
    navigation?.setOptions?.(defaultOptions);
    navigator.current = new StackClass(navigation, defaultOptions);
  });

  if (
    Platform.OS === 'android' &&
    !routeParams?.options?.isOverrideBackHandler
  ) {
    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          if (isActionBackPress.current) return true;
          isActionBackPress.current = setTimeout(() => {
            isActionBackPress.current = null;
          }, 250);
          utils.goBackSafe({
            navigation,
            route,
            onPressLeftHeader: navigator?.current?.defaultOptions?.onPressLeftHeader,
          });
          return true;
        };
        // HungHC delay 200ms adding backHandler
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        setTimeout(() => {
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
        }, 100);
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, [route]),
      routeParams.navigation || navigation,
    );
  }

  useEffect(
    () => () => {
      isActionBackPress.current = null;
    },
    [],
  );

  return {
    params,
    defaultOptions,
    navigator: navigator.current,
    ScreenComp,
  };
};

module.exports = {
  useNavigator,
  useSingleton,
};
