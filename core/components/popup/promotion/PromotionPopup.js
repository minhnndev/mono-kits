import {get} from 'lodash';
import React, {Component} from 'react';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import ValueUtils from '../../../utils/ValueUtil';
import FastImage from '../../image/FastImage';
import Button from '../../button/Button';
import Radius from '../../../radius';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const POPUP_WIDTH = screenWidth * 0.87;
const IMAGE_HEIGHT = POPUP_WIDTH * (160 / 327);

const styles = StyleSheet.create({
  container: {
    width: POPUP_WIDTH,
    maxHeight: 540,
    flex: 1,
  },
  body: {
    marginTop: 13,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderRadius: Radius.M,
  },
  image: {
    height: '100%',
    width: POPUP_WIDTH,
  },
});

export default class PromotionPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensions: {},
    };
  }

  componentDidMount() {
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

  componentWillUnmount() {
    this.subscription?.remove?.();
  }

  onPressClose = () => {
    const {requestClose} = this.props;
    if (requestClose && typeof requestClose === 'function') {
      requestClose(this.close);
    } else {
      this.close();
    }
  };

  onPressIconClose = () => {
    const {requestClose} = this.props;
    if (requestClose && typeof requestClose === 'function') {
      requestClose(this.iconClose);
    } else {
      this.iconClose();
    }
  };

  iconClose = () => {
    const {onPressIconClose} = this.props;
    if (onPressIconClose && typeof onPressIconClose === 'function')
      onPressIconClose();
  };

  close = () => {
    const {onPressClose} = this.props;
    if (onPressClose && typeof onPressClose === 'function') onPressClose();
  };

  onPressAction = () => {
    const {requestClose} = this.props;
    if (requestClose && typeof requestClose === 'function') {
      requestClose(this.fireAction);
    } else {
      this.fireAction();
    }
  };

  fireAction = () => {
    const {onPressAction} = this.props;
    if (onPressAction && typeof onPressAction === 'function') onPressAction();
  };

  render() {
    const {
      source,
      style,
      imgStyle,
      imgResizeMode,
      buttonTitle = 'Đóng',
    } = this.props;
    const {dimensions} = this.state;
    const imageSource = ValueUtils.getImageSource(source);
    const resizeMode = imgResizeMode || 'cover';
    const popupWidth =
      dimensions?.width > 0 ? dimensions?.width * 0.87 : POPUP_WIDTH;
    const imageWidth =
      popupWidth -
      get(imgStyle, 'margin', 0) -
      get(imgStyle, 'marginHorizontal', 0);

    return (
      <View style={[styles.container, {width: popupWidth}]}>
        <View style={[styles.body, style]}>
          {source ? (
            <FastImage
              style={[styles.image, {width: imageWidth}, imgStyle]}
              source={imageSource}
              resizeMode={resizeMode}
            />
          ) : (
            <View />
          )}
          <Button
            style={{
              width: popupWidth - 48,
              position: 'absolute',
              bottom: 24,
              left: 24,
            }}
            onPress={this.onPressClose}
            title={buttonTitle}
          />
        </View>
      </View>
    );
  }
}

PromotionPopup.propTypes = {};
