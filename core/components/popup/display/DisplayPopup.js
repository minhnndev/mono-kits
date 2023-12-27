import React, {Component} from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import Text from '../../typography';
import Button from '../../button/Button';
import Colors from '../../../colors';
import {Icons} from '../../../icons';
import FastImage from '../../image/FastImage';
import ValueUtils from '../../../utils/ValueUtil';
import Input from '../../textInput/Input';
import {RFValueHorizontal as ScaleSize} from '../../typography/reponsiveSize';
import Spacing from '../../../spacing';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const POPUP_WIDTH = screenWidth * 0.87;
const IMAGE_HEIGHT = POPUP_WIDTH * (160 / 327);

const styles = StyleSheet.create({
  container: {
    width: POPUP_WIDTH,
    alignSelf: 'center',
  },
  body: {
    marginTop: 13,
    // minHeight: IMAGE_HEIGHT,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    height: IMAGE_HEIGHT,
    width: POPUP_WIDTH,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  closeIconView: {
    position: 'absolute',
    top: 0,
    right: -12,
  },
  closeIcon: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  title: {
    color: Colors.black_17,
    fontWeight: 'bold',
  },
  content: {
    color: Colors.black_17,
    marginTop: Spacing.S,
  },
  description: {
    color: Colors.black_12,
    marginTop: Spacing.S,
  },
  view: {
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  rowButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  columnButton: {
    flexDirection: 'column-reverse',
    alignItems: 'stretch',
  },
  columnTextButton: {
    flexDirection: 'column-reverse',
    alignItems: 'flex-end',
  },
  buttonView: {
    marginTop: 12,
  },
  buttonMargin: {
    marginVertical: Spacing.M,
  },
  textButtonMargin: {
    marginVertical: Spacing.XL,
  },
  textCloseButton: {
    color: Colors.disabled,
  },
  textButton: {
    fontWeight: 'bold',
  },
});

const hitSlop = {
  top: 5,
  left: 5,
  bottom: 5,
  right: 5,
};

export default class DisplayPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensions: {},
    };
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
    if (onPressIconClose && typeof onPressIconClose === 'function') {
      onPressIconClose();
    }
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

  renderButtons = () => {
    const {
      actionButton,
      closeButton,
      buttonType,
      buttonIcon,
      buttonRightIcon,
      buttons,
      renderButton,
      requestClose,
      buttonDirection = 'row',
      renderCustomCloseButton,
      buttonContainerStyle,
      buttonSeparatorStyle,
      primaryColor = Colors.pink_05,
    } = this.props;
    const renderCustomButton = (item, index) =>
      renderButton(item, index, requestClose);
    let directionButtonStyle =
      buttonDirection === 'column' ? styles.columnButton : styles.rowButton;
    let buttonStyle = buttonDirection === 'column' ? {} : {flex: 1};

    const rowTitleLength = 15;
    const isLongButtonTitle =
      (!!actionButton && actionButton.length > rowTitleLength) ||
      (!!closeButton && closeButton.length > rowTitleLength);

    if (isLongButtonTitle) {
      directionButtonStyle = styles.columnButton;
      buttonStyle = {};
    }
    return (
      <View
        style={
          closeButton
            ? [styles.textButtonMargin, buttonContainerStyle]
            : [styles.buttonMargin, buttonContainerStyle]
        }>
        {(!closeButton && actionButton) || (!actionButton && closeButton) ? (
          <Button
            icon={buttonIcon}
            rightIcon={buttonRightIcon}
            onPress={
              this.props.onPressAction ? this.onPressAction : this.onPressClose
            }
            accessibilityLabel={'btn_popup_allow'}
            type={buttonType}
            size={'medium'}
            title={actionButton ? actionButton : closeButton}
            buttonStyle={{backgroundColor: primaryColor}}
          />
        ) : (
          <View />
        )}
        {buttons?.length > 0 && renderButton && buttons.map(renderCustomButton)}
        {closeButton && actionButton ? (
          <View style={[styles.rowButton, directionButtonStyle]}>
            {typeof renderCustomCloseButton === 'function' ? (
              renderCustomCloseButton(closeButton, requestClose)
            ) : (
              <TouchableOpacity
                style={[
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  buttonStyle,
                ]}
                accessibilityLabel={'btn_popup_cancel'}
                onPress={this.onPressClose}>
                <Text.Body
                  weight={'bold'}
                  numberOfLines={1}
                  style={{color: primaryColor}}>
                  {closeButton}
                </Text.Body>
              </TouchableOpacity>
            )}
            {(buttonDirection === 'column' || isLongButtonTitle) && (
              <View
                style={[
                  {
                    width: 8,
                    height: Spacing.S,
                  },
                  buttonSeparatorStyle,
                ]}
              />
            )}
            <Button
              style={buttonStyle}
              type="primary"
              size={'medium'}
              title={actionButton}
              accessibilityLabel={'btn_popup_allow'}
              buttonStyle={{backgroundColor: primaryColor}}
              onPress={this.onPressAction}
            />
          </View>
        ) : (
          <View />
        )}
      </View>
    );
  };
  render() {
    const {
      title,
      content,
      hideCloseIcon = false,
      source,
      renderCustomContent,
      style,
      imgStyle,
      imgResizeMode,
      contentStyle,
      scrollViewProps,
      isInput,
      inputProps,
      avaSource,
      avaStyle,
      description,
    } = this.props;
    const {dimensions} = this.state;
    const imageSource = ValueUtils.getImageSource(source);
    const avatarSource = ValueUtils.getImageSource(avaSource);
    const resizeMode = imgResizeMode || 'cover';
    const popupWidth =
      dimensions?.width > 0 ? dimensions?.width * 0.87 : POPUP_WIDTH;
    const imageWidth =
      popupWidth -
      get(imgStyle, 'margin', 0) -
      get(imgStyle, 'marginHorizontal', 0);
    const imageHeight =
      IMAGE_HEIGHT -
      get(imgStyle, 'margin', 0) -
      get(imgStyle, 'marginVertical', 0);
    const maxContentHeight =
      screenHeight / 2 -
      (Object.keys(imageSource).length === 0 ? 0 : imageHeight);

    return (
      <View style={[styles.container, {width: popupWidth}]}>
        {avaSource ? (
          <FastImage
            style={[
              {
                width: ScaleSize(84),
                height: ScaleSize(84),
                borderRadius: ScaleSize(42),
                position: 'absolute',
                top: source ? imageHeight - ScaleSize(28) : -ScaleSize(28),
                left: POPUP_WIDTH / 2 - ScaleSize(42),
                zIndex: 99,
              },
              avaStyle,
            ]}
            source={avatarSource}
          />
        ) : (
          <View />
        )}
        <View style={[styles.body, style]}>
          {source ? (
            <View>
              <FastImage
                style={[
                  styles.image,
                  {
                    width: imageWidth,
                    height: imageHeight,
                  },
                  imgStyle,
                ]}
                source={imageSource}
                resizeMode={resizeMode}
              />
            </View>
          ) : (
            <View />
          )}

          <View style={[styles.view, {marginTop: avaSource ? 32 : 0}]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              {...scrollViewProps}
              style={[
                {
                  maxHeight: maxContentHeight,
                  marginTop: 18,
                },
                contentStyle,
              ]}>
              {!!title && (
                <Text.Body style={styles.title} numberOfLines={3}>
                  {title}
                </Text.Body>
              )}
              {!!content && (
                <Text.Body style={styles.content}>{content}</Text.Body>
              )}
              {!!description && (
                <Text.Caption style={styles.description}>
                  {description}
                </Text.Caption>
              )}
              {!!isInput && (
                <Input
                  hideMessageError
                  style={{marginTop: 20}}
                  {...inputProps}
                />
              )}
              {renderCustomContent?.()}
            </ScrollView>
            {this.renderButtons()}
          </View>
        </View>
        {!hideCloseIcon ? (
          <View style={styles.closeIconView}>
            <TouchableOpacity onPress={this.onPressIconClose}>
              <FastImage
                tintColor="#222222"
                style={styles.closeIcon}
                source={Icons.ic_close_24}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}
      </View>
    );
  }
}

DisplayPopup.propTypes = {
  actionButton: PropTypes.string,
  buttonType: PropTypes.string,
  closeButtonType: PropTypes.string,
  closeButton: PropTypes.string,
  content: PropTypes.string,
  hideCloseIcon: PropTypes.bool,
  onPressAction: PropTypes.func,
  onPressClose: PropTypes.func,
  title: PropTypes.string,
  imgStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  contentStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  imgResizeMode: PropTypes.oneOf(['contain', 'cover', 'stretch', 'center']),
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  buttonIcon: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  buttonRightIcon: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  actionButtonType: PropTypes.oneOf(['button', 'text']),
  renderCustomContent: PropTypes.func,
  renderCustomCloseButton: PropTypes.func,
  buttonContainerStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  buttonSeparatorStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  textSeparatorStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  scrollViewProps: PropTypes.object,
  isInput: PropTypes.bool,
  inputProps: PropTypes.object,
  buttonDirection: PropTypes.oneOf(['column', 'row']),
};
