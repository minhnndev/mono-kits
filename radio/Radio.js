import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Text,
  ValueUtil,
  TouchableOpacity,
  Colors,
  Image,
} from '@momo-kits/core';
import PropTypes from 'prop-types';
import {isEmpty} from 'lodash';

const styles = StyleSheet.create({
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.black_01,
  },
  selectedButton: {
    backgroundColor: Colors.pink_05_b,
    borderWidth: 0,
  },
  disableButton: {
    backgroundColor: Colors.pink_09,
    borderWidth: 0,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  disableTitle: {
    color: Colors.black_08,
  },
  disableDefault: {
    width: 20,
    height: 20,
    backgroundColor: Colors.black_02,
    borderColor: Colors.black_04,
    borderRadius: 10,
  },
  disableDot: {
    backgroundColor: Colors.black_02,
  },
  defaultRadioButton: {
    backgroundColor: Colors.black_01,
    borderColor: Colors.black_17,
    borderWidth: 1,
  },
  radioButtonSize: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    marginLeft: 5,
    color: Colors.black_15,
  },
  image: {
    height: 42,
    width: 42,
    borderRadius: 4,
    resizeMode: 'contain',
    marginLeft: 15,
  },
});
export default class Radio extends Component {
  render() {
    const {
      disable,
      selected,
      hideTitle,
      valueStyle,
      value,
      onPress,
      disableOnChange,
      style,
      radioStyle,
    } = this.props;
    let customStyle = {};
    let customTitle = {};
    let customDotStyle = {};
    if (selected) {
      customStyle = styles.selectedButton;
    }
    if (disable && selected) {
      customStyle = styles.disableButton;
      customTitle = styles.disableTitle;
      customDotStyle = styles.centerDot;
    } else if (disable && !selected) {
      customStyle = styles.disableDefault;
      customTitle = styles.disableTitle;
      customDotStyle = styles.disableDot;
    }
    const imageUrl = ValueUtil.getImageSource(value);

    return (
      <TouchableOpacity
        style={style}
        disabled={disable || disableOnChange}
        onPress={onPress}>
        <View style={styles.row}>
          <View
            style={[
              styles.radioButtonSize,
              styles.defaultRadioButton,
              radioStyle,
              customStyle,
            ]}>
            <View style={[styles.centerDot, customDotStyle]} />
          </View>
          {!hideTitle ? (
            <Text.Title
              style={[
                styles.textContent,
                ValueUtil.extractStyle(valueStyle),
                customTitle,
              ]}>
              {value}
            </Text.Title>
          ) : (
            <View />
          )}
          {!isEmpty(imageUrl) ? (
            <Image
              style={[styles.image, ValueUtil.extractStyle(valueStyle)]}
              source={imageUrl}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

Radio.propTypes = {
  disable: PropTypes.bool,
  selected: PropTypes.bool,
  hideTitle: PropTypes.bool,
  valueStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  value: PropTypes.string,
  onPress: PropTypes.func,
  disableOnChange: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Radio.defaultProps = {};
