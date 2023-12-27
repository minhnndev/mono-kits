/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-lonely-if */
/* eslint-disable no-tabs */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/destructuring-assignment */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Dimensions,
    Animated,
    PanResponder,
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import { Colors, ValueUtil, Text } from '@momo-kits/core';
import { TouchableHighlight } from 'react-native';

const DEFAULT_PREVIEW_OPEN_DELAY = 700;
const PREVIEW_CLOSE_DELAY = 300;
const MAX_VELOCITY_CONTRIBUTION = 5;
const SCROLL_LOCK_MILLISECONDS = 300;
const SCREEN_WIDTH = Dimensions.get('window').width;
const WIDTH_HIDDEN_RIGHT = 190;
class SwipeAction extends Component {
    constructor(props) {
        super(props);
        this.isOpen = false;
        this.previousTrackedTranslateX = 0;
        this.previousTrackedDirection = null;
        this.horizontalSwipeGestureBegan = false;
        this.swipeInitialX = null;
        this.parentScrollEnabled = true;
        this.ranPreview = false;
        this._ensureScrollEnabledTimer = null;
        this.isForceClosing = false;
        this.state = {
            dimensionsSet: false,
            hiddenHeight: this.props.disableHiddenLayoutCalculation
                ? '100%'
                : 0,
            hiddenWidth: this.props.disableHiddenLayoutCalculation ? '100%' : 0,
            isLeftActionVisible: false,
            isRightActionVisible: false,
            leftOpenValue: 0,
            rightOpenValue: 0,
        };
        const { leftAction, rightAction } = this.props;
        const buttonCellWidth = WIDTH_HIDDEN_RIGHT / 2;
        // leftAction ? this.leftOpenValue = leftAction.length * buttonCellWidth : 0;
        // rightAction ? this.rightOpenValue = -rightAction.length * buttonCellWidth : 0;
        this.stopLeftSwipe = SCREEN_WIDTH;
        this.stopRightSwipe = -SCREEN_WIDTH;
        this._translateX = new Animated.Value(0);
        if (this.props.onSwipeValueChange) {
            this._translateX.addListener(({ value }) => {
                let direction = this.previousTrackedDirection;
                if (value !== this.previousTrackedTranslateX) {
                    direction =
                        value > this.previousTrackedTranslateX
                            ? 'right'
                            : 'left';
                }
                this.props.onSwipeValueChange &&
                    this.props.onSwipeValueChange({
                        isOpen: this.isOpen,
                        direction,
                        value,
                    });
                this.previousTrackedTranslateX = value;
                this.previousTrackedDirection = direction;
            });
        }

        if (
            this.props.forceCloseToRightThreshold &&
            this.props.forceCloseToRightThreshold > 0
        ) {
            this._translateX.addListener(({ value }) => {
                if (
                    !this.isForceClosing &&
                    SCREEN_WIDTH + value < this.props.forceCloseToRightThreshold
                ) {
                    this.isForceClosing = true;
                    this.forceCloseRow('right');
                    if (this.props.onForceCloseToRight) {
                        this.props.onForceCloseToRight();
                    }
                }
            });
        }

        if (
            this.props.forceCloseToLeftThreshold &&
            this.props.forceCloseToLeftThreshold > 0
        ) {
            this._translateX.addListener(({ value }) => {
                if (
                    !this.isForceClosing &&
                    SCREEN_WIDTH - value < this.props.forceCloseToLeftThreshold
                ) {
                    this.isForceClosing = true;
                    this.forceCloseRow('left');
                    if (this.props.onForceCloseToLeft) {
                        this.props.onForceCloseToLeft();
                    }
                }
            });
        }
    }

    UNSAFE_componentWillMount() {
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (e, gs) =>
                this.handleOnMoveShouldSetPanResponder(e, gs),
            onPanResponderMove: (e, gs) => this.handlePanResponderMove(e, gs),
            onPanResponderRelease: (e, gs) => this.handlePanResponderEnd(e, gs),
            onPanResponderTerminate: (e, gs) =>
                this.handlePanResponderEnd(e, gs),
            onShouldBlockNativeResponder: (_) => false,
        });
    }

    componentWillUnmount() {
        clearTimeout(this._ensureScrollEnabledTimer);
        this._translateX.removeAllListeners();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (
            this.state.hiddenHeight !== nextState.hiddenHeight ||
            this.state.hiddenWidth !== nextState.hiddenWidth ||
            !this.props.shouldItemUpdate ||
            (this.props.shouldItemUpdate &&
                this.props.shouldItemUpdate(this.props.item, nextProps.item))
        ) {
            return true;
        }

        return false;
    }

    getPreviewAnimation(toValue, delay) {
        return Animated.timing(this._translateX, {
            duration: this.props.previewDuration,
            toValue,
            delay,
            useNativeDriver: this.props.useNativeDriver,
        });
    }

    onContentLayout(e) {
        this.setState({
            dimensionsSet: !this.props.recalculateHiddenLayout,
            ...(!this.props.disableHiddenLayoutCalculation
                ? {
                      hiddenHeight: e.nativeEvent.layout.height,
                      hiddenWidth: e.nativeEvent.layout.width,
                  }
                : {}),
        });

        if (this.props.preview && !this.ranPreview) {
            this.ranPreview = true;
            const previewOpenValue =
                this.props.previewOpenValue || this.state.rightOpenValue * 0.5;
            this.getPreviewAnimation(
                previewOpenValue,
                this.props.previewOpenDelay,
            ).start((_) => {
                this.getPreviewAnimation(0, PREVIEW_CLOSE_DELAY).start();
            });
        }
    }

    onPress() {
        if (this.swipeInitialX == null || this.swipeInitialX === 0) {
            if (
                this.props.onPress &&
                typeof this.props.onPress === 'function'
            ) {
                this.props.onPress();
            }
        } else {
            if (this.props.closeOnPress) {
                this.closeRow();
            }
        }
    }

    handleOnMoveShouldSetPanResponder(e, gs) {
        const { dx } = gs;
        return Math.abs(dx) > this.props.directionalDistanceChangeThreshold;
    }

    handlePanResponderMove(e, gestureState) {
        /* If the view is force closing, then ignore Moves. Return */
        if (this.isForceClosing) {
            return;
        }

        /* Else, do normal job */
        const { dx, dy } = gestureState;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        // this check may not be necessary because we don't capture the move until we pass the threshold
        // just being extra safe here
        if (
            absDx > this.props.directionalDistanceChangeThreshold ||
            absDy > this.props.directionalDistanceChangeThreshold
        ) {
            // we have enough to determine direction
            if (absDy > absDx && !this.horizontalSwipeGestureBegan) {
                // user is moving vertically, do nothing, listView will handle
                return;
            }

            // user is moving horizontally
            if (this.parentScrollEnabled) {
                // disable scrolling on the listView parent
                this.parentScrollEnabled = false;
                this.props.setScrollEnabled &&
                    this.props.setScrollEnabled(false);
            }

            if (this.swipeInitialX === null) {
                // set tranlateX value when user started swiping
                this.swipeInitialX = this._translateX._value;
            }
            if (!this.horizontalSwipeGestureBegan) {
                this.horizontalSwipeGestureBegan = true;
                const direction = dx > 0 ? 'TO_RIGHT' : 'TO_LEFT';
                this.props.swipeGestureBegan &&
                    this.props.swipeGestureBegan(direction);
            }

            let newDX = this.swipeInitialX + dx;
            if (this.props.disableRightAction && newDX < 0) {
                newDX = 0;
            }
            if (this.props.disableLeftAction && newDX > 0) {
                newDX = 0;
            }

            if (this.stopLeftSwipe && newDX > this.stopLeftSwipe) {
                newDX = this.stopLeftSwipe;
            }
            if (this.stopRightSwipe && newDX < this.stopRightSwipe) {
                newDX = this.stopRightSwipe;
            }

            // set action buttons visibility
            if (newDX > 0) {
                this.setState({
                    isLeftActionVisible: true,
                    isRightActionVisible: false,
                });
            } else if (newDX < 0) {
                this.setState({
                    isRightActionVisible: true,
                    isLeftActionVisible: false,
                });
            }

            this._translateX.setValue(newDX);
        }
    }

    ensureScrollEnabled = () => {
        if (!this.parentScrollEnabled) {
            this.parentScrollEnabled = true;
            this.props.setScrollEnabled && this.props.setScrollEnabled(true);
        }
    };

    handlePanResponderEnd(e, gestureState) {
        /* PandEnd will reset the force-closing state when it's true. */
        if (this.isForceClosing) {
            this.isForceClosing = false;
        }
        // decide how much the velocity will affect the final position that the list item settles in.
        const { swipeToOpenVelocityContribution } = this.props;
        const possibleExtraPixels =
            this.state.rightOpenValue * swipeToOpenVelocityContribution;
        const clampedVelocity = Math.min(
            gestureState.vx,
            MAX_VELOCITY_CONTRIBUTION,
        );
        const projectedExtraPixels =
            possibleExtraPixels * (clampedVelocity / MAX_VELOCITY_CONTRIBUTION);

        // re-enable scrolling on listView parent
        this._ensureScrollEnabledTimer = setTimeout(
            this.ensureScrollEnabled,
            SCROLL_LOCK_MILLISECONDS,
        );

        // finish up the animation
        let toValue = 0;
        if (this._translateX._value >= 0) {
            // trying to swipe right
            if (this.swipeInitialX < this._translateX._value) {
                if (
                    this._translateX._value - projectedExtraPixels >
                    this.state.leftOpenValue *
                        (this.props.swipeToOpenPercent / 100)
                ) {
                    // we're more than halfway
                    toValue = this.state.leftOpenValue;
                }
            } else if (
                this._translateX._value - projectedExtraPixels >
                this.state.leftOpenValue *
                    (1 - this.props.swipeToClosePercent / 100)
            ) {
                toValue = this.state.leftOpenValue;
            }
        } else {
            // trying to swipe left
            if (this.swipeInitialX > this._translateX._value) {
                if (
                    this._translateX._value - projectedExtraPixels <
                    this.state.rightOpenValue *
                        (this.props.swipeToOpenPercent / 100)
                ) {
                    // we're more than halfway
                    toValue = this.state.rightOpenValue;
                }
            } else if (
                this._translateX._value - projectedExtraPixels <
                this.state.rightOpenValue *
                    (1 - this.props.swipeToClosePercent / 100)
            ) {
                toValue = this.state.rightOpenValue;
            }
        }

        this.props.swipeGestureEnd && this.props.swipeGestureEnd();
        this.manuallySwipeRow(toValue);
    }

    /*
     * This method is called by SwipeListView
     */
    closeRow() {
        this.manuallySwipeRow(0);
    }

    /**
     * Force close the row toward the end of the given direction.
     * @param  {String} direction The direction to force close.
     */
    forceCloseRow(direction) {
        this.manuallySwipeRow(0, () => {
            if (direction === 'right' && this.props.onForceCloseToRightEnd) {
                this.props.onForceCloseToRightEnd();
            } else if (
                direction === 'left' &&
                this.props.onForceCloseToLeftEnd
            ) {
                this.props.onForceCloseToLeftEnd();
            }
        });
    }

    closeRowWithoutAnimation() {
        this._translateX.setValue(0);

        this.ensureScrollEnabled();
        this.isOpen = false;
        this.props.onDidClose && this.props.onDidClose();

        this.props.onClose && this.props.onClose();

        this.swipeInitialX = null;
        this.horizontalSwipeGestureBegan = false;
    }

    manuallySwipeRow(toValue, onAnimationEnd) {
        Animated.spring(this._translateX, {
            toValue,
            friction: this.props.friction,
            tension: this.props.tension,
            useNativeDriver: this.props.useNativeDriver,
        }).start((_) => {
            this._translateX.setValue(toValue);
            this.ensureScrollEnabled();
            if (toValue === 0) {
                this.isOpen = false;
                this.props.onDidClose && this.props.onDidClose();
            } else {
                this.isOpen = true;
                this.props.onDidOpen && this.props.onDidOpen(toValue);
            }
            if (onAnimationEnd) {
                onAnimationEnd();
            }
        });

        if (toValue === 0) {
            this.props.onClose && this.props.onClose();
        } else {
            this.props.onOpen && this.props.onOpen(toValue);
        }

        // reset everything
        this.swipeInitialX = toValue;
        this.horizontalSwipeGestureBegan = false;
    }

    renderVisibleContent() {
        if (this.props.children) {
            // handle touchables
            const { onPress } = this.props.children.props;

            if (onPress) {
                const newOnPress = (_) => {
                    this.onPress();
                    onPress();
                };
                return React.cloneElement(this.props.children, {
                    ...this.props.children.props,
                    onPress: newOnPress,
                });
            }
            return (
                <TouchableHighlight
                    activeOpacity={0.8}
                    underlayColor="white"
                    onPress={(_) => this.onPress()}>
                    {this.props.children}
                </TouchableHighlight>
            );
        }
    }

    renderRowContent() {
        // We do this annoying if statement for performance.
        // We don't want the onLayout func to run after it runs once.
        if (this.state.dimensionsSet) {
            return (
                <Animated.View
                    manipulationModes={['translateX']}
                    {...this._panResponder.panHandlers}
                    style={{
                        zIndex: 2,
                        transform: [{ translateX: this._translateX }],
                    }}>
                    {this.renderVisibleContent()}
                </Animated.View>
            );
        }
        return (
            <Animated.View
                manipulationModes={['translateX']}
                {...this._panResponder.panHandlers}
                onLayout={(e) => this.onContentLayout(e)}
                style={{
                    zIndex: 2,
                    transform: [{ translateX: this._translateX }],
                }}>
                {this.renderVisibleContent()}
            </Animated.View>
        );
    }

    onLeftActionLayout = ({ nativeEvent }) => {
        this.setState({
            leftOpenValue: nativeEvent.layout.width,
        });
    };

    onRightActionLayout = ({ nativeEvent }) => {
        this.setState({
            rightOpenValue: -nativeEvent.layout.width,
        });
    };

    renderHiddenContent = () => {
        const { actionBackground, rowIndex, rightAction, leftAction } =
            this.props;
        const hiddenRowStyle = {
            ...styles.standaloneRowBack,
            ...{ backgroundColor: actionBackground },
        };
        return (
            <View style={hiddenRowStyle}>
                {this.state.isLeftActionVisible && (
                    <View style={styles.leftItemRow}>
                        <View
                            style={{ flexDirection: 'row' }}
                            onLayout={this.onLeftActionLayout}>
                            {leftAction?.map?.((item, index) =>
                                this.renderLeftAction(item, index),
                            )}
                        </View>
                    </View>
                )}
                {this.state.isRightActionVisible && (
                    <View style={styles.rightItemRow}>
                        <View
                            style={{ flexDirection: 'row' }}
                            onLayout={this.onRightActionLayout}>
                            {rightAction
                                ?.slice?.(0)
                                ?.reverse()
                                .map((item, index) =>
                                    this.renderRightAction(item, index),
                                )}
                        </View>
                    </View>
                )}
            </View>
        );
    };

    renderIcon = (icon) => {
        const { actionIconStyle } = this.props;
        const iconSource = ValueUtil.getImageSource(icon);
        return (
            <Image
                source={iconSource}
                resizeMode="contain"
                style={[styles.icon, actionIconStyle]}
            />
        );
    };

    renderTitle = (title) => {
        const { actionTextStyle } = this.props;
        return (
            <Text.SubTitle style={[styles.text, actionTextStyle]}>
                {title}
            </Text.SubTitle>
        );
    };

    onActionPress = (item, rowIndex) => () => {
        const { onPress } = item;
        onPress?.(item, rowIndex);
    };

    renderRightAction = (item, index) => {
        const { rowIndex, renderRightAction } = this.props;
        if (renderRightAction) {
            return (
                <View key={item + index}>
                    {renderRightAction({ item, index, rowIndex })}
                </View>
            );
        }
        return (
            <TouchableOpacity
                key={index.toString()}
                style={[
                    styles.buttonContainer,
                    {
                        backgroundColor: item.color,
                        height: this.state.hiddenHeight,
                    },
                ]}
                onPress={this.onActionPress(item, rowIndex)}>
                {item.icon && this.renderIcon(item.icon)}
                {item.title && this.renderTitle(item.title)}
            </TouchableOpacity>
        );
    };

    renderLeftAction = (item, index) => {
        const { rowIndex, renderLeftAction } = this.props;
        if (renderLeftAction) {
            return (
                <View key={item + index}>
                    {renderLeftAction({ item, index, rowIndex })}
                </View>
            );
        }
        return (
            <TouchableOpacity
                key={index.toString()}
                style={[
                    styles.buttonContainer,
                    {
                        backgroundColor: item.color,
                        height: this.state.hiddenHeight,
                    },
                ]}
                onPress={this.onActionPress(item, rowIndex)}>
                {item.icon && this.renderIcon(item.icon)}
                {item.title && this.renderTitle(item.title)}
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <View
                style={this.props.style ? this.props.style : styles.container}>
                <View
                    style={[
                        styles.hidden,
                        {
                            height: this.state.hiddenHeight,
                            width: this.state.hiddenWidth,
                        },
                    ]}>
                    {this.renderHiddenContent()}
                </View>
                {this.renderRowContent()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // As of RN 0.29 flex: 1 is causing all rows to be the same height
        // flex: 1
    },
    hidden: {
        zIndex: 1,
        bottom: 0,
        left: 0,
        overflow: 'hidden',
        position: 'absolute',
        right: 0,
        top: 0,
    },
    standaloneRowBack: {
        backgroundColor: Colors.white,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftItemRow: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingRight: 10,
    },
    rightItemRow: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: 10,
    },
    buttonContainer: {
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        width: 88,
    },
    icon: {
        height: 24,
        width: 24,
        tintColor: 'white',
    },
    text: {
        color: Colors.white,
        textAlign: 'center',
        marginHorizontal: 10,
        marginTop: 10,
    },
});

SwipeAction.propTypes = {
    onOpen: PropTypes.func,
    closeOnPress: PropTypes.bool,
    disableRightAction: PropTypes.bool,
    disableLeftAction: PropTypes.bool,
    onClose: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    leftAction: PropTypes.array,
    rightAction: PropTypes.array,
    renderRightAction: PropTypes.func,
    renderLeftAction: PropTypes.func,
    onPress: PropTypes.func,
    children: PropTypes.element.isRequired,
    actionBackground: PropTypes.string,
    actionTextStyle: PropTypes.object,
    swipeGestureBegan: PropTypes.func,
    swipeGestureEnd: PropTypes.func,
};

SwipeAction.defaultProps = {
    closeOnPress: true,
    disableRightAction: true,
    disableLeftAction: true,
    recalculateHiddenLayout: false,
    disableHiddenLayoutCalculation: false,
    preview: false,
    previewDuration: 300,
    previewOpenDelay: DEFAULT_PREVIEW_OPEN_DELAY,
    directionalDistanceChangeThreshold: 2,
    swipeToOpenPercent: 50,
    swipeToOpenVelocityContribution: 0,
    swipeToClosePercent: 50,
    swipeToPerformActionPercent: 50,
    item: {},
    useNativeDriver: true,
    rightAction: [],
    leftAction: [],
    actionBackground: Colors.white,
};

export default SwipeAction;
