import React from 'react';
import { Image, Platform } from 'react-native';
import NavigationButton from './NavigationButton';
import imgs from '../assets/imgs';
import utils from '../assets/utils';

const { goBackSafe } = utils;

const defaultBackButton = Platform.OS === 'ios' ? imgs.ic_back_ios : imgs.ic_back_android;

export default class NavigationBackButton extends React.Component {
    constructor(props) {
        super(props);
        const {
            route, icon, iconStyle, tintColor
        } = this.props;
        const { options, defaultOptions } = route.params || {};
        // eslint-disable-next-line prefer-const
        let { headerLeftIcon, headerLeftStyle, headerTintColor } = { ...defaultOptions, ...options } || {};
        this.icon = headerLeftIcon || icon || defaultBackButton;
        this.headerTintColor = headerTintColor || tintColor;

        if (headerLeftIcon && !headerLeftStyle) {
            const { width, height } = Image.resolveAssetSource(headerLeftIcon);
            headerLeftStyle = { width: iconStyle.height * width / height, height: iconStyle.height };
        }
        this.iconStyle = headerLeftStyle || iconStyle;
    }

    onPress = () => {
        const { navigation, route, onPressLeftHeader = null } = this.props;
        goBackSafe({ navigation, route, onPressLeftHeader });
    };

    render() {
        const { color } = this.props;
        return (
            <NavigationButton
                style={{ marginLeft: 20 }}
                icon={this.icon}
                iconStyle={this.iconStyle}
                onPress={this.onPress}
                tintColor={this.headerTintColor}
                color={color}
            />
        );
    }
}
