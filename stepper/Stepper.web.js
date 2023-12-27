import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';
import Text from '../../core/components/typography';
import Colors from '../../core/colors';

const minus =
  'https://img.mservice.io/momo_app_v2/new_version/img/appx_icon/24_navigation_minus_circle.png';
const plus =
  'https://img.mservice.io/momo_app_v2/new_version/img/appx_icon/24_navigation_plus_circle.png';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  icon: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
    tintColor: Colors.pink_03,
  },
  text: {
    color: Colors.black_17,
  },
  numberBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    backgroundColor: Colors.white,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderColor: 'transparent',
  },
  borderBox: {
    borderColor: Colors.black_04,
    borderWidth: 1,
    borderRadius: 6,
  },
  disabledIcon: {
    tintColor: Colors.black_09,
  },
  disabledBox: {
    borderColor: Colors.black_03,
    backgroundColor: Colors.black_03,
  },
});

const getStyle = type => {
  const objStyle = {
    large: {
      size: {
        ...styles.borderBox,
        width: 32, // height: 26
      },
      icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
      },
      text: 'Title',
    },
    medium: {
      size: {
        ...styles.borderBox,
        width: 28, // height: 24
      },
      icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
      },
      text: 'SubTitle',
    },
    small: {
      size: {
        ...styles.borderBox,
        width: 20, // height: 16
      },
      icon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
      },
      text: 'Caption',
    },
  };
  return objStyle[type] || objStyle.medium;
};

const getSize = type => {
  const objStyle = {
    large: {
      size: {
        width: 32,
        height: 24, // height: 26
      },
    },
    medium: {
      size: {
        width: 28,
        height: 24, // height: 24
      },
    },
    small: {
      size: {
        width: 20,
        height: 16, // height: 16
      },
    },
  };
  return objStyle[type] || objStyle.medium;
};

export default class Quantity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue || props.min,
      ownUpdate: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {value = undefined} = this?.props || {};
    if (prevState.ownUpdate) {
      return {
        ownUpdate: false,
      };
    }
    if (nextProps.value !== value && nextProps.value !== prevState.value) {
      return {value: nextProps.value};
    }
    return null;
  }

  onChangeValue = (value, type) => {
    const {onChange} = this.props;
    return onChange && typeof onChange === 'function' && onChange(value, type);
  };

  getValue = (key, step) => {
    const {isIncreaseValue, isDecreaseValue} = this.props;
    const value = {
      increase: isIncreaseValue ? step : 0,
      decrease: isDecreaseValue ? step : 0,
    };
    return value[key];
  };

  setValue = (newValue = 0, type) => {
    const {isInput, isIncreaseValue, max, min} = this.props;
    const onValue = (newValue, type) => {
      this.setState(
        {
          value: newValue,
          ownUpdate: true,
        },
        () => {
          this.onChangeValue(newValue, type);
        },
      );
    };

    if (isInput) {
      if (newValue <= max && isIncreaseValue && newValue >= min) {
        onValue(newValue, type);
      }
    } else {
      onValue(newValue, type);
    }
  };

  onPress =
    (isIncrease = true, step) =>
    () => {
      const {isChangeValue, onConditionCheck} = this.props;
      const {value} = this.state;
      const type = isIncrease ? 'increase' : 'decrease';
      if (isChangeValue) {
        const newValue = isIncrease
          ? value + this.getValue('increase', step)
          : value - this.getValue('decrease', step);
        if (typeof onConditionCheck === 'function') {
          const passCondition = onConditionCheck(newValue, type);
          if (passCondition) {
            this.setValue(newValue, type);
          }
        } else {
          this.setValue(newValue, type);
        }
      } else {
        this.onChangeValue(value, type);
      }
    };

  render() {
    const {value} = this.state;
    const {
      style,
      max,
      valueStyle,
      size,
      tintColor,
      isIncreaseValue,
      isSingle,
      iconStyle,
      isInput,
    } = this.props;
    const {min} = this.props || 1;
    if (isSingle && value === 0) {
      return (
        <View style={[styles.container, style]}>
          <IconButton
            tintColor={tintColor}
            size={size}
            disabled={value >= max || !isIncreaseValue}
            onPress={this.onPress(true)}
            icon={plus}
          />
        </View>
      );
    }
    const TextComp = Text[getStyle(size).text];
    return (
      <View style={[styles.container, style]}>
        <IconButton
          style={iconStyle}
          tintColor={tintColor}
          size={size}
          disabled={value === min}
          onPress={this.onPress(false)}
          icon={minus}
        />
        <View style={[styles.numberBox, getStyle(size).size, valueStyle]}>
          {isInput ? (
            <TextInput
              style={[{textAlignVertical: 'center'}, getSize(size).size]}
              underlineColorAndroid="transparent"
              value={value.toString()}
              textAlign="center"
              maxLength={3}
              keyboardType="number-pad"
              onChangeText={text => this.setValue(text)}
            />
          ) : (
            <TextComp weight="bold" style={styles.text}>
              {value}
            </TextComp>
          )}
        </View>
        <IconButton
          tintColor={tintColor}
          style={iconStyle}
          size={size}
          disabled={value >= max || !isIncreaseValue}
          onPress={this.onPress(true)}
          icon={plus}
        />
      </View>
    );
  }
}

const IconButton = ({disabled, onPress, icon, size, tintColor, style}) => (
  <TouchableOpacity
    style={[getStyle(size).size, styles.button, style]} // disabled && styles.disabledBox
    disabled={disabled}
    onPress={onPress}>
    <Image
      source={icon}
      style={[
        getStyle(size).icon,
        {tintColor},
        disabled && styles.disabledIcon,
      ]}
    />
  </TouchableOpacity>
);

Quantity.propTypes = {
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  valueStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  defaultValue: PropTypes.number,
  onChange: PropTypes.func,
  isChangeValue: PropTypes.bool,
  isIncreaseValue: PropTypes.bool,
  isDecreaseValue: PropTypes.bool,
  isSingle: PropTypes.bool,
  tintColor: PropTypes.string,
  iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  isInput: PropTypes.bool,
  step: PropTypes.number,
};

Quantity.defaultProps = {
  min: 1,
  max: 100,
  isChangeValue: true,
  isIncreaseValue: true,
  isDecreaseValue: true,
  isSingle: false,
  size: 'medium',
  tintColor: Colors.pink_05_b,
  isInput: false,
  step: 1,
};
