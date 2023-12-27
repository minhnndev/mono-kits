/* eslint-disable react/display-name */
import React from 'react';
import { Platform } from 'react-native';
import colors from '../../../colors';
import {
    NavigationBackButton, NavigationBar, NavigationSearchBar, NavigationAnimatedHeader, NavigationTitle
} from '../components';
import imgs from './imgs';

const { headerAnimatedPosition, headerAnimatedTitle, headerAnimatedBackground } = NavigationAnimatedHeader;

const icon = Platform.OS === 'ios' ? imgs.ic_back_ios : imgs.ic_back_android;

const iconStyle = Platform.OS === 'ios' ? { width: 24, height: 24 } : { width: 24, height: 24 };

const customTitle = (props) => ({
    ...props.hideLeft ? { headerLeft: () => null } : { headerTitleContainerStyle: { left: 60 } },
    headerTitle: () => <NavigationTitle {...props} />
});

const searchHeader = (props) => ({
    headerRight: () => <NavigationSearchBar {...props} />,
});

const headerLeft = (props, tintColor = colors.white) => ({
    headerLeft: (headerProps) => (
        <NavigationBackButton {... {
            ...props, ...headerProps, icon, iconStyle, tintColor
        }}
        />
    )
});

const stackHeader = (props) => ({
    ...headerLeft(props),
    title: '',
    headerStyle: {
        backgroundColor: colors.primary, borderBottomWidth: 0
    },
    headerTintColor: colors.white,
    headerTitleAlign: 'center',
    headerTitleStyle: {
        fontWeight: '600'
    },
    headerBackground: (headerProps) => <NavigationBar {...headerProps} />,
    ...props.route.params.defaultOptions
});

const modalHeader = (props) => ({
    ...headerLeft(props, colors.black),
    title: '',
    headerStyle: { backgroundColor: colors.white, borderBottomWidth: 0 },
    headerTintColor: colors.black,
    headerTitleAlign: 'center',
    headerTitleStyle: {
        color: colors.black,
        fontWeight: '600'
    },
    headerBackground: (headerProps) => <NavigationBar {...headerProps} />,
    ...props.route.params.defaultOptions
});

const animatedHeader = (props) => ({
    headerTransparent: true,
    headerRight: () => headerAnimatedPosition('right', props),
    headerLeft: () => headerAnimatedPosition('left', props),
    headerBackground: () => headerAnimatedBackground(props),
    headerTitle: () => headerAnimatedTitle(props),
});

module.exports = {
    icon,
    iconStyle,
    animatedHeader,
    modalHeader,
    stackHeader,
    headerLeft,
    searchHeader,
    customTitle
};
