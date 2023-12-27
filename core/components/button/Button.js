/* eslint-disable indent */
import React, {Component} from 'react';
import {View, StyleSheet, Image, Dimensions, Platform} from 'react-native';
import PropTypes from 'prop-types';
import Text from '../typography';
import Colors from '../../colors';
import NumberUtils from '../../utils/NumberUtils';
import TouchableOpacity from '../touchableOpacity/TouchableOpacity';
import {RFValueHorizontal} from '../typography/reponsiveSize';
import {DynamicSize} from '../../utils/ScreenUtils';

export const ButtonType = {
  primary: 'primary',
  warning: 'warning',
  success: 'success',
  disabled: 'disabled',
  danger: 'danger',
  secondary: 'secondary',
  outline: 'outline',
  dashed: 'dashed',
  indifferent: 'indifferent',
};

export const ButtonSize = {
  small: 'small',
  medium: 'medium',
  large: 'large',
  iconOnly: 'iconOnly',
};

const buttonStyles = StyleSheet.create({
  container: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    flexDirection: 'row',
  },
  round: {
    borderRadius: 16,
  },
  primary: {
    backgroundColor: Colors.pink_05_b,
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.pink_05_b,
  },
  disabled: {
    backgroundColor: Colors.black_02,
  },
  secondary: {
    borderWidth: 1,
    borderColor: Colors.black_04,
    backgroundColor: Colors.black_01,
  },
  danger: {
    backgroundColor: Colors.red_05,
  },
  warning: {
    backgroundColor: Colors.warning,
  },
  success: {
    backgroundColor: Colors.success,
  },
  dashed: {
    borderWidth: 1,
    borderColor: Colors.pink_05_b,
    backgroundColor: Colors.black_01,
    borderStyle: 'dashed',
  },
  indifferent: {
    backgroundColor: Colors.black_01,
    borderRadius: 0,
  },
  iconOnly: {
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const buttonSize = width => ({
  small: {
    height: 28,
    minWidth: DynamicSize(60, width),
  },
  medium: {
    height: 36,
    minWidth: DynamicSize(78, width),
  },
  large: {
    height: 48,
    minWidth: DynamicSize(96, width),
  },
  iconOnly: {
    height: 36,
    width: 36,
  },
});

const titleStyles = width => ({
  default: {
    fontSize: RFValueHorizontal(16, width),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  primary: {
    color: Colors.black_01,
  },
  outline: {
    color: Colors.pink_05,
  },
  disabled: {
    color: Colors.black_09,
  },
  secondary: {
    color: Colors.black_17,
  },
  indifferent: {
    color: Colors.black_12,
    fontWeight: 'bold',
  },
  dashed: {
    color: Colors.pink_05,
  },
  small: {
    fontSize: RFValueHorizontal(12, width),
  },
  medium: {
    fontSize: RFValueHorizontal(14, width),
  },
  large: {
    fontSize: RFValueHorizontal(16, width),
  },
});

const iconStyles = width => ({
  default: {
    width: DynamicSize(20, width),
    height: DynamicSize(20, width),
  },
  left: {
    marginRight: 8,
  },
  right: {
    marginLeft: 8,
  },
  primary: {
    tintColor: Colors.black_01,
  },
  outline: {
    tintColor: Colors.primary,
  },
  disabled: {
    tintColor: Colors.black_09,
  },
  secondary: {
    tintColor: Colors.disabled,
  },
  dashed: {
    tintColor: Colors.primary,
  },
  small: {
    width: DynamicSize(16, width),
    height: DynamicSize(16, width),
  },
  medium: {
    width: DynamicSize(16, width),
    height: DynamicSize(16, width),
  },
  large: {
    width: DynamicSize(24, width),
    height: DynamicSize(24, width),
  },
  iconOnly: {
    width: 16,
    height: 16,
    margin: 0,
  },
});

export default class Button extends Component {
  constructor(props) {
    super(props);
    this.clickable = true;
    this.clickableTimeout = null;
    this.countdownTimmer = null;
    this.state = {
      countdownCounter: 0,
      second: props.countdown || 0,
      dimensions: {},
    };
  }

  componentDidMount() {
    const {countdown, onCountdownEnd} = this.props;
    if (countdown) {
      setTimeout(() => {
        this.startTimmer(countdown, onCountdownEnd);
      }, 1000);
    }

    this.subscription = Dimensions.addEventListener('change', ({window}) => {
      if (
        window?.height > 0 &&
        window?.width > 0 &&
        Platform.OS === 'android'
      ) {
        this.setState({dimensions: window});
      }
    });
  }

  startTimmer = (second, callback) => {
    clearInterval(this.countdownTimmer);
    this.setState(
      {
        countdownCounter: 0,
        second,
      },
      () => {
        this.countdownTimmer = setInterval(() => {
          this.setState(
            preState => ({
              countdownCounter: preState.countdownCounter + 1,
            }),
            () => {
              const {countdownCounter} = this.state;
              if (countdownCounter >= second) {
                clearInterval(this.countdownTimmer);
                if (typeof callback === 'function') callback();
              }
            },
          );
        }, 1000);
      },
    );
  };

  clearTimmer = (clear = true, callback) => {
    clearInterval(this.countdownTimmer);
    if (clear && typeof callback === 'function') {
      this.setState(
        {
          countdownCounter: 0,
          second: 0,
        },
        callback,
      );
    } else if (typeof callback === 'function') {
      callback();
    }
  };

  componentWillUnmount() {
    this.subscription?.remove?.();
    if (this.countdownTimmer) clearInterval(this.countdownTimmer);
    if (this.clickableTimeout) clearTimeout(this.clickableTimeout);
  }

  mapButtonSize = size => {
    const {dimensions} = this.state;
    let mapSize = {};
    let title = {};
    let icon = {};
    switch (size) {
      case ButtonSize.small:
        mapSize = buttonSize(dimensions?.width || null).small;
        title = titleStyles(dimensions?.width || null).small;
        icon = iconStyles(dimensions?.width || null).small;
        break;
      case ButtonSize.medium:
        mapSize = buttonSize(dimensions?.width || null).medium;
        title = titleStyles(dimensions?.width || null).medium;
        icon = iconStyles(dimensions?.width || null).medium;
        break;
      case ButtonSize.large:
        mapSize = buttonSize(dimensions?.width || null).large;
        title = titleStyles(dimensions?.width || null).large;
        icon = iconStyles(dimensions?.width || null).large;
        break;
      case ButtonSize.iconOnly:
        mapSize = buttonSize(dimensions?.width || null).iconOnly;
        icon = iconStyles(dimensions?.width || null).iconOnly;
        break;
      default:
        mapSize = buttonSize(dimensions?.width || null).large;
        title = titleStyles(dimensions?.width || null).large;
        icon = iconStyles(dimensions?.width || null).large;
        break;
    }
    return {mapSize, title, icon};
  };

  mapStyleFromType = (type, size, primaryColor) => {
    const {dimensions} = this.state;
    let button = {};
    let title = {};
    let icon = {};
    switch (type) {
      case ButtonType.primary:
        button = primaryColor
          ? {backgroundColor: primaryColor}
          : buttonStyles.primary;
        title = titleStyles(dimensions?.width || null).primary;
        icon = iconStyles(dimensions?.width || null).primary;
        break;
      case ButtonType.warning:
        button = buttonStyles.warning;
        title = titleStyles(dimensions?.width || null).primary;
        icon = iconStyles(dimensions?.width || null).primary;
        break;
      case ButtonType.success:
        button = buttonStyles.success;
        title = titleStyles(dimensions?.width || null).primary;
        icon = iconStyles(dimensions?.width || null).primary;
        break;
      case ButtonType.outline:
        button = buttonStyles.outline;
        title = titleStyles(dimensions?.width || null).outline;
        icon = iconStyles(dimensions?.width || null).outline;
        break;
      case ButtonType.disabled:
        button = buttonStyles.disabled;
        title = titleStyles(dimensions?.width || null).disabled;
        icon = iconStyles(dimensions?.width || null).disabled;
        break;
      case ButtonType.secondary:
        button = buttonStyles.secondary;
        title = titleStyles(dimensions?.width || null).secondary;
        icon = iconStyles(dimensions?.width || null).secondary;
        break;
      case ButtonType.dashed:
        button = buttonStyles.dashed;
        title = titleStyles(dimensions?.width || null).dashed;
        icon = iconStyles(dimensions?.width || null).dashed;
        break;
      case ButtonType.danger:
        button = buttonStyles.danger;
        title = titleStyles(dimensions?.width || null).primary;
        icon = iconStyles(dimensions?.width || null).primary;
        break;
      case ButtonType.indifferent:
        button = buttonStyles.indifferent;
        title = titleStyles(dimensions?.width || null).indifferent;
        icon = iconStyles(dimensions?.width || null).secondary;
        break;
      default:
        button = buttonStyles.primary;
        title = titleStyles(dimensions?.width || null).primary;
        icon = iconStyles(dimensions?.width || null).primary;
    }
    const mapSize = this.mapButtonSize(size);
    title = {...title, ...mapSize.title};
    icon = {...icon, ...mapSize.icon};
    return {
      button,
      title,
      icon,
      size: mapSize.mapSize,
    };
  };

  pressDisabled = type => {
    const {onPress} = this.props;
    return type === ButtonType.disabled || onPress === undefined;
  };

  onPress = () => {
    // if (!this.clickable) return;
    // this.clickable = false;
    // this.clickableTimeout = setTimeout(() => {
    //     this.clickable = true;
    // }, 300);
    const {onPress} = this.props;
    if (onPress && typeof onPress === 'function') {
      onPress();
    }
  };

  render() {
    const {
      type,
      title,
      icon,
      rightIcon,
      onPress,
      style,
      buttonStyle = {},
      titleStyle = {},
      iconStyle = {},
      size,
      delay,
      primaryColor,
      signlePress,
    } = this.props;
    const {dimensions} = this.state;
    const mapStyle = this.mapStyleFromType(type, size, primaryColor);
    const {second, countdownCounter} = this.state;
    const minute = NumberUtils.roundNumber(
      Math.floor((second - countdownCounter) / 60),
    );
    const remianSecond = NumberUtils.roundNumber(
      (second - countdownCounter) % 60,
    );
    let butonTitle = title;
    if (second) {
      butonTitle = `${title} (${minute}:${remianSecond} giây)`;
    }
    const buttonView =
      size !== 'iconOnly' ? (
        <View
          style={[
            buttonStyles.container,
            mapStyle.button,
            mapStyle.size,
            buttonStyle,
          ]}>
          {typeof icon === 'number' || (icon && icon.uri) ? (
            <Image
              source={icon}
              resizeMode="contain"
              style={[
                iconStyles(dimensions?.width || null).default,
                iconStyles(dimensions?.width || null).left,
                mapStyle.icon,
                iconStyle,
              ]}
            />
          ) : (
            icon || <View />
          )}
          <Text.Title
            numberOfLines={1}
            style={[
              titleStyles(dimensions?.width || null).default,
              mapStyle.title,
              titleStyle,
            ]}>
            {butonTitle}
          </Text.Title>
          {typeof rightIcon === 'number' || (rightIcon && rightIcon.uri) ? (
            <Image
              source={rightIcon}
              resizeMode="contain"
              style={[
                iconStyles(dimensions?.width || null).default,
                iconStyles(dimensions?.width || null).right,
                mapStyle.icon,
                iconStyle,
              ]}
            />
          ) : (
            rightIcon || <View />
          )}
        </View>
      ) : (
        <View
          style={[
            buttonStyles.iconOnly,
            mapStyle.button,
            mapStyle.size,
            buttonStyle,
          ]}>
          {typeof icon === 'number' || (icon && icon.uri) ? (
            <Image
              source={icon}
              resizeMode="contain"
              style={[
                iconStyles(dimensions?.width || null).default,
                iconStyles(dimensions?.width || null).iconOnly,
                mapStyle.icon,
                iconStyle,
              ]}
            />
          ) : (
            icon || <View />
          )}
        </View>
      );

    if (onPress && typeof onPress === 'function' && !this.pressDisabled(type)) {
      return (
        <TouchableOpacity
          accessibilityLabel={`${butonTitle || ''}/Button`}
          delay={delay || 1000}
          activeOpacity={0.5}
          signlePress={signlePress}
          onPress={this.onPress}
          style={style}>
          {buttonView}
        </TouchableOpacity>
      );
    }
    return (
      <View accessibilityLabel={`${butonTitle || ''}/Button`} style={style}>
        {buttonView}
      </View>
    );
  }
}

Button.propTypes = {
  buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  icon: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({uri: PropTypes.string}),
    PropTypes.func,
  ]),
  onPress: PropTypes.func,
  rightIcon: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({uri: PropTypes.string}),
    PropTypes.func,
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'iconOnly']),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  type: PropTypes.oneOf([
    'primary',
    'disabled',
    'danger',
    'warning',
    'success',
    'outline',
    'secondary',
    'dashed',
    'indifferent',
  ]),
  onCountdownEnd: PropTypes.func,
  countdown: PropTypes.number,
  delay: PropTypes.number,
  signlePress: PropTypes.bool,
};
Button.defaultProps = {};
