/* eslint-disable no-param-reassign */
import { StackActions } from '@react-navigation/native';
import { Keyboard } from 'react-native';
import LoadingPopup from '../../popup/loading/LoadingPopup';
import themes from '../assets/themes';

export default class Navigator {
    constructor(navigation, defaultOptions) {
        this.navigation = navigation;
        this.defaultOptions = defaultOptions || {};
        this.routeMap = {};
    }

    setOptions(options) {
        this.defaultOptions = {
            ...this.defaultOptions,
            ...options,
        };

        if (
            options?.onPressLeftHeader &&
            (options?.headerLeft || this.defaultOptions?.headerLeft)
        ) {
            this.navigation.setOptions({
                ...options,
                ...themes.headerLeft({
                    navigation: this.navigation,
                    onPressLeftHeader: options.onPressLeftHeader,
                    route: { params: { defaultOptions: this.defaultOptions } },
                }),
            });
            return;
        }
        if (options?.customTitle) {
            this.navigation.setOptions({
                ...options,
                ...themes.customTitle(options?.customTitle),
            });
            return;
        }
        this.navigation.setOptions(options);
    }

    setSearchHeader(options) {
        this.navigation.setOptions(
            themes.searchHeader({
                ...options,
                defaultOptions: this.defaultOptions,
                navigation: this.navigation,
            }),
        );
    }

    setAnimatedHeader(options) {
        let cloneOptions = { ...this.defaultOptions };
        if (
            this.defaultOptions?.headerLeft &&
            this.defaultOptions?.onPressLeftHeader
        ) {
            cloneOptions = {
                ...cloneOptions,
                ...themes.headerLeft({
                    navigation: this.navigation,
                    onPressLeftHeader: this.defaultOptions?.onPressLeftHeader,
                    route: { params: { defaultOptions: this.defaultOptions } },
                }),
            };
        }
        this.navigation.setOptions(
            themes.animatedHeader({
                ...options,
                defaultOptions: cloneOptions,
                navigation: this.navigation,
            }),
        );
    }

    navigate(route, name = 'Stack') {
        const keyRoute = route?.screen?.name || '';
        if (!this.routeMap[keyRoute]) {
            this.routeMap[keyRoute] = true;
            const navigateRoute = {
                ...route,
                options: route.options || {},
            };
            this.navigation.navigate({
                name,
                key: `${name}_${new Date().getTime()}`,
                params: {
                    ...navigateRoute,
                },
            });

            /**
             * handle opening many screen (duplicate screen) when navigate screen
             */
            setTimeout(() => {
                delete this.routeMap[keyRoute];
            }, 500);
        }
    }

    present = (route) => {
        this.navigate(route, 'Modal');
    };

    show = (params) => {
        this.navigate(params, 'Dialog');
    };

    showLoading = (params) => {
        this.navigate({ params, screen: LoadingPopup }, 'Dialog');
    };

    showBottom = (params) => {
        Keyboard.dismiss();
        params.position = 'bottom';
        this.navigate(params, 'Dialog');
    };

    dismiss = () => {
        const action = StackActions.pop(1);
        this.navigation.dispatch(action);
    };
}
