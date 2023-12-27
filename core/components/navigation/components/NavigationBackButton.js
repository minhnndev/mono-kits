import React from 'react';
import {Image} from 'react-native';
import NavigationButton from './NavigationButton';
import utils from '../assets/utils';
import icons from '../../icon/cached_images.json';
import Colors from '../../../colors';
import Radius from '../../../radius';
import Spacing from '../../../spacing';

const {goBackSafe} = utils;

export default class NavigationBackButton extends React.Component {
  constructor(props) {
    super(props);
    const {route, icon, iconStyle, tintColor} = this.props;
    const {options, defaultOptions} = route.params || {};
    let {headerLeftIcon, headerLeftStyle, headerTintColor} = {
      ...defaultOptions,
      ...options,
      ...{},
    };
    this.icon = headerLeftIcon || icon || icons.ic_back.uri;
    this.headerTintColor = headerTintColor || tintColor;

    if (headerLeftIcon && !headerLeftStyle) {
      const {width, height} = Image.resolveAssetSource(headerLeftIcon);
      headerLeftStyle = {
        width: (iconStyle.height * width) / height,
        height: iconStyle.height,
      };
    }
    this.iconStyle = headerLeftStyle || iconStyle;
  }

  onPress = () => {
    const {navigation, route, onPressLeftHeader = null} = this.props;
    const {options} = route.params ?? {};
    goBackSafe({
      navigation,
      route,
      onPressLeftHeader: onPressLeftHeader ?? options?.onPressLeftHeader,
    });
  };

  render() {
    const {color, style} = this.props;
    return (
      <NavigationButton
        style={[
          {
            marginLeft: 12,
            backgroundColor: Colors.opacity_01_black_40,
            borderRadius: Radius.L,
            padding: Spacing.XS,
          },
          style,
        ]}
        icon={this.icon}
        iconStyle={this.iconStyle}
        onPress={this.onPress}
        tintColor={this.headerTintColor}
        color={color}
        accessibilityLabel="NavigationBackButton"
      />
    );
  }
}
