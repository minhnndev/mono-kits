/* eslint no-underscore-dangle: ["error", { "allow": ["_value"] }] */


import React, { Component } from 'react';
import { Animated, PanResponder, Dimensions } from 'react-native';

export default class DraggableView extends Component {
    constructor(props) {
        super(props);

        this.pan = new Animated.ValueXY();
        this.allowedDirections = [].concat(props.swipeDirection);
        this.layout = null;
    }

    componentDidMount() {
        this.panEventListenerId = this.pan.addListener((axis) => {
            const { onMove } = this.props;
            onMove(this.createDragEvent(axis));
        });
    }

    componentWillUnmount() {
        this.pan.removeListener(this.panEventListenerId);
    }

  onLayout = (event) => {
      this.layout = event.nativeEvent.layout;
  }

  getSwipeDirection(gestureState) {
      if (this.isValidHorizontalSwipe(gestureState)) {
          return (gestureState.dx > 0) ? 'right' : 'left';
      } if (this.isValidVerticalSwipe(gestureState)) {
          return (gestureState.dy > 0) ? 'down' : 'up';
      }
      return null;
  }

  getDisappearDirection() {
      const { width, height } = Dimensions.get('window');
      const vertical = ((height / 2) + (this.layout.height / 2));
      const horizontal = ((width / 2) + (this.layout.width / 2));
      let toValue;
      if (this.currentSwipeDirection === 'up') {
          toValue = {
              x: 0,
              y: -vertical,
          };
      } else if (this.currentSwipeDirection === 'down') {
          toValue = {
              x: 0,
              y: vertical,
          };
      } else if (this.currentSwipeDirection === 'left') {
          toValue = {
              x: -horizontal,
              y: 0,
          };
      } else if (this.currentSwipeDirection === 'right') {
          toValue = {
              x: horizontal,
              y: 0,
          };
      }
      return toValue;
  }

  isValidHorizontalSwipe({ vx, dy }) {
      return this.isValidSwipe(vx, dy);
  }

  isValidVerticalSwipe({ vy, dx }) {
      return this.isValidSwipe(vy, dx);
  }

  // eslint-disable-next-line class-methods-use-this
  isValidSwipe(velocity, directionalOffset) {
      const velocityThreshold = 0.3;
      const directionalOffsetThreshold = 80;
      // eslint-disable-next-line max-len
      return Math.abs(velocity) > velocityThreshold && Math.abs(directionalOffset) < directionalOffsetThreshold;
  }

  isAllowedDirection({ dy, dx }) {
      const draggedDown = dy > 0;
      const draggedUp = dy < 0;
      const draggedLeft = dx < 0;
      const draggedRight = dx > 0;
      const isAllowedDirection = (d) => (
          this.currentSwipeDirection === d && this.allowedDirections.includes(d)
      );
      if (draggedDown && isAllowedDirection('down')) {
          return true;
      } if (draggedUp && isAllowedDirection('up')) {
          return true;
      } if (draggedLeft && isAllowedDirection('left')) {
          return true;
      } if (draggedRight && isAllowedDirection('right')) {
          return true;
      }
      return false;
  }

  createDragEvent(axis) {
      return {
          axis,
          layout: this.layout,
          swipeDirection: this.currentSwipeDirection,
      };
  }

  panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => (
          gestureState.dx !== 0 && gestureState.dy !== 0
      ),
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
          const isVerticalSwipe = (d) => ['up', 'down'].includes(d);
          const isHorizontalSwipe = (d) => ['left', 'right'].includes(d);

          const newSwipeDirection = this.getSwipeDirection(gestureState);
          const isSameDirection = isVerticalSwipe(this.currentSwipeDirection) === isVerticalSwipe(newSwipeDirection)
        || isHorizontalSwipe(this.currentSwipeDirection) === isHorizontalSwipe(newSwipeDirection);
          // newDirection & currentSwipeDirection must be same direction
          if (newSwipeDirection && isSameDirection) {
              this.currentSwipeDirection = newSwipeDirection;
          }
          if (this.isAllowedDirection(gestureState)) {
              let animEvent;
              if (isVerticalSwipe(this.currentSwipeDirection)) {
                  animEvent = { dy: this.pan.y };
              } else if (isHorizontalSwipe(this.currentSwipeDirection)) {
                  animEvent = { dx: this.pan.x };
              }
              Animated.event([null, animEvent])(event, gestureState);
              const { onSwiping } = this.props;
              onSwiping(this.createDragEvent({
                  x: this.pan.x._value,
                  y: this.pan.y._value,
              }));
          }
      },
      onPanResponderRelease: () => {
          this.pan.flattenOffset();
          const event = this.createDragEvent({
              x: this.pan.x._value,
              y: this.pan.y._value,
          });
          const {
              onSwipeOut, swipeThreshold, onSwipingOut, onRelease
          } = this.props;
          // on swipe out
          if (onSwipeOut && Math.abs(this.pan.y._value) > swipeThreshold
        || Math.abs(this.pan.x._value) > swipeThreshold
          ) {
              onSwipingOut(event);
              Animated.spring(this.pan, {
                  toValue: this.getDisappearDirection(),
                  velocity: 0,
                  tension: 65,
                  friction: 11,
                  useNativeDriver: true
              }).start(() => {
                  onSwipeOut(event);
              });
              return;
          }
          // on release
          this.currentSwipeDirection = null;
          onRelease(event);
          Animated.spring(this.pan, {
              toValue: { x: 0, y: 0 },
              velocity: 0,
              tension: 65,
              friction: 11,
              useNativeDriver: true
          }).start();
      },
  });

  render() {
      const { style, children: renderContent, dragDisabled } = this.props;
      const content = renderContent({
          pan: this.pan,
          onLayout: this.onLayout,
      });
      console.log(dragDisabled)
      if (dragDisabled) {
          return (
              <Animated.View
                  style={style}
              >
                  {content}
              </Animated.View>
          );
      }
      return (
          <Animated.View
              {...this.panResponder.panHandlers}
              style={style}
          >
              {content}
          </Animated.View>
      );
  }
}

DraggableView.defaultProps = {
    style: null,
    onMove: () => {},
    onSwiping: () => {},
    onSwipingOut: () => {},
    onSwipeOut: null,
    onRelease: () => {},
    swipeThreshold: 100,
    swipeDirection: [],
    dragDisabled: false
};
