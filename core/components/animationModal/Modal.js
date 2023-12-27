import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  BackAndroid as RNBackAndroid,
  BackHandler as RNBackHandler,
  NativeModules,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

const isAndroid = Platform.OS === 'android';

import DraggableView from './components/DraggableView';
import Backdrop from './components/Backdrop';
import FadeAnimation from './animations/FadeAnimation';

const BackHandler = RNBackHandler || RNBackAndroid;

// dialog states
const MODAL_OPENING = 'opening';
const MODAL_OPENED = 'opened';
const MODAL_CLOSING = 'closing';
const MODAL_CLOSED = 'closed';

// default dialog config
const DEFAULT_ANIMATION_DURATION = 150;

// event types
const HARDWARE_BACK_PRESS_EVENT = 'hardwareBackPress';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 10,
  },
  modal: {
    // overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  hidden: {
    top: -10000,
    left: 0,
    height: 0,
    width: 0,
  },
  draggableView: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

class Modal extends Component {
  constructor(props) {
    super(props);
    const isLowPerformance =
      NativeModules?.RNDeviceInfo?.devicePerformance === 'low-end';

    this.state = {
      modalAnimation:
        props.modalAnimation ||
        new FadeAnimation({
          animationDuration:
            isLowPerformance && isAndroid ? 0 : props.animationDuration,
        }),
      modalState: MODAL_CLOSED,
    };
  }

  componentDidMount() {
    const {visible} = this.props;
    if (visible) {
      this.show();
    }
    BackHandler.addEventListener(
      HARDWARE_BACK_PRESS_EVENT,
      this.onHardwareBackPress,
    );
    // BackHandler.removeEventListener(HARDWARE_BACK_PRESS_EVENT, this.onHardwareBackPress);
    // BackHandler.addEventListener(HARDWARE_BACK_PRESS_EVENT, this.onHardwareBackPress);
    // setTimeout(() => {
    //     BackHandler.removeEventListener(HARDWARE_BACK_PRESS_EVENT, this.onHardwareBackPress);
    //     BackHandler.addEventListener(HARDWARE_BACK_PRESS_EVENT, this.onHardwareBackPress);
    // }, 200);
  }

  componentDidUpdate(prevProps) {
    const {visible} = this.props;
    if (visible !== prevProps.visible) {
      if (visible) {
        this.show();
        return;
      }
      this.dismiss();
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      HARDWARE_BACK_PRESS_EVENT,
      this.onHardwareBackPress,
    );
  }

  onHardwareBackPress = () => {
    const {onHardwareBackPress} = this.props;
    onHardwareBackPress && onHardwareBackPress();
    return true;
  };

  get pointerEvents() {
    const {overlayPointerEvents} = this.props;
    const {modalState} = this.state;
    if (overlayPointerEvents) {
      return overlayPointerEvents;
    }
    return modalState === MODAL_OPENED ? 'auto' : 'none';
  }

  get modalSize() {
    const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
    let {width, height} = this.props;
    if (width && width > 0.0 && width <= 1.0) {
      width *= screenWidth;
    }
    if (height && height > 0.0 && height <= 1.0) {
      height *= screenHeight;
    }
    return {width, height};
  }

  show() {
    this.setState({modalState: MODAL_OPENING}, () => {
      const {modalAnimation} = this.state;
      modalAnimation.in(() => {
        const {onShow} = this.props;
        this.setState({modalState: MODAL_OPENED}, onShow);
      });
    });
  }

  dismiss() {
    this.setState({modalState: MODAL_CLOSING}, () => {
      const {onDismiss} = this.props;
      if (this.isSwipingOut) {
        this.setState({modalState: MODAL_CLOSED}, onDismiss);
        return;
      }
      const {modalAnimation} = this.state;
      modalAnimation.out(() => {
        this.setState({modalState: MODAL_CLOSED}, onDismiss);
      });
    });
  }

  handleMove = event => {
    const {modalState} = this.state;
    // prevent flashing when modal is closing and onMove callback invoked
    if (modalState === MODAL_CLOSING) {
      return;
    }
    if (!this.lastSwipeEvent) {
      this.lastSwipeEvent = event;
    }
    let newOpacity;
    const {overlayOpacity} = this.props;
    const opacity = overlayOpacity;
    if (Math.abs(event.axis.y)) {
      const lastAxis = Math.abs(this.lastSwipeEvent.layout.y);
      const currAxis = Math.abs(event.axis.y);
      newOpacity =
        opacity -
        (opacity * currAxis) / (Dimensions.get('window').height - lastAxis);
    } else {
      const lastAxis = Math.abs(this.lastSwipeEvent.layout.x);
      const currAxis = Math.abs(event.axis.x);
      newOpacity =
        opacity -
        (opacity * currAxis) / (Dimensions.get('window').width - lastAxis);
    }
    this.backdrop.setOpacity(newOpacity);
  };

  handleSwipingOut = event => {
    this.isSwipingOut = true;
    const {onSwipingOut} = this.props;
    onSwipingOut(event);
  };

  render() {
    const {modalState, modalAnimation} = this.state;
    const {
      children,
      onTouchOutside,
      hasOverlay,
      modalStyle,
      animationDuration,
      overlayOpacity,
      useNativeDriver,
      overlayBackgroundColor,
      style,
      onSwiping,
      onSwipeRelease,
      onSwipeOut,
      swipeDirection,
      swipeThreshold,
      dragDisabled,
      isBottomModal,
      accessibilityLabel = '',
    } = this.props;

    const overlayVisible =
      hasOverlay && [MODAL_OPENING, MODAL_OPENED].includes(modalState);
    const hidden = modalState === MODAL_CLOSED && styles.hidden;

    return (
      <View style={[styles.container, hidden]}>
        <DraggableView
          dragDisabled={dragDisabled}
          style={StyleSheet.flatten([styles.draggableView, style])}
          onMove={this.handleMove}
          onSwiping={onSwiping}
          onRelease={onSwipeRelease}
          onSwipingOut={this.handleSwipingOut}
          onSwipeOut={onSwipeOut}
          swipeDirection={swipeDirection}
          swipeThreshold={swipeThreshold}>
          {({pan, onLayout}) => (
            <>
              <Backdrop
                ref={ref => {
                  this.backdrop = ref;
                }}
                pointerEvents={this.pointerEvents}
                visible={overlayVisible}
                onPress={onTouchOutside}
                backgroundColor={overlayBackgroundColor}
                opacity={overlayOpacity}
                animationDuration={animationDuration}
                useNativeDriver={useNativeDriver}
              />
              {Platform.OS === 'ios' && isBottomModal ? (
                <KeyboardAvoidingView behavior="padding">
                  <Animated.View onLayout={onLayout}>
                    <Animated.View
                      accessibilityLabel={`${accessibilityLabel}/ ${
                        isBottomModal ? 'BottomSheet' : 'Modal'
                      }`}
                      style={[
                        styles.modal,
                        this.modalSize,
                        modalStyle,
                        modalAnimation.getAnimations(),
                      ]}>
                      {children}
                    </Animated.View>
                  </Animated.View>
                </KeyboardAvoidingView>
              ) : (
                <Animated.View onLayout={onLayout}>
                  <Animated.View
                    accessibilityLabel={`${accessibilityLabel}/${
                      isBottomModal ? 'BottomSheet' : 'Modal'
                    }`}
                    style={[
                      styles.modal,
                      this.modalSize,
                      modalStyle,
                      modalAnimation.getAnimations(),
                    ]}>
                    {children}
                  </Animated.View>
                </Animated.View>
              )}
            </>
          )}
        </DraggableView>
      </View>
    );
  }
}

Modal.propTypes = {
  animationDuration: PropTypes.any,
  children: PropTypes.any,
  dragDisabled: PropTypes.bool,
  hasOverlay: PropTypes.bool,
  height: PropTypes.any,
  modalAnimation: PropTypes.any,
  modalStyle: PropTypes.any,
  onDismiss: PropTypes.func,
  onHardwareBackPress: PropTypes.func,
  onMove: PropTypes.func,
  onShow: PropTypes.func,
  onSwipeOut: PropTypes.any,
  onSwipeRelease: PropTypes.func,
  onSwiping: PropTypes.func,
  onSwipingOut: PropTypes.func,
  onTouchOutside: PropTypes.func,
  overlayBackgroundColor: PropTypes.string,
  overlayOpacity: PropTypes.number,
  overlayPointerEvents: PropTypes.any,
  style: PropTypes.any,
  swipeDirection: PropTypes.any,
  swipeThreshold: PropTypes.any,
  useNativeDriver: PropTypes.bool,
  visible: PropTypes.bool,
  width: PropTypes.any,
};

Modal.defaultProps = {
  visible: false,
  style: null,
  animationDuration: DEFAULT_ANIMATION_DURATION,
  modalStyle: null,
  width: null,
  height: null,
  onTouchOutside: () => {},
  onHardwareBackPress: () => false,
  hasOverlay: true,
  overlayOpacity: 0.5,
  overlayPointerEvents: null,
  overlayBackgroundColor: '#000',
  onShow: () => {},
  onDismiss: () => {},
  onMove: () => {},
  onSwiping: () => {},
  onSwipeRelease: () => {},
  onSwipingOut: () => {},
  useNativeDriver: true,
  dragDisabled: false,
};

export default Modal;
