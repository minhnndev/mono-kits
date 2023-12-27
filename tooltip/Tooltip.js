/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-spread */
/* eslint-disable indent */
/* eslint-disable no-param-reassign */

import React from 'react';
import PropTypes from 'prop-types';
import {
    Platform, Dimensions, Animated, TouchableWithoutFeedback, View, Modal, Keyboard, Easing, I18nManager, SafeAreaView, StyleSheet, StatusBar
} from 'react-native';
import { Spacing, Text, Colors } from '@momo-kits/core';
import {
    Rect, Point, Size, isRect, isPoint, rectChanged, pointChanged, waitForNewRect, runAfterChange, getRectForRef
} from './Helper';

const DEFAULT_ARROW_SIZE = new Size(16, 8);
const DEFAULT_BORDER_RADIUS = 8;
const FIX_SHIFT = Dimensions.get('window').height * 2;

const isIOS = Platform.OS === 'ios';

const DEBUG = false;

const PLACEMENT_OPTIONS = Object.freeze({
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left',
    AUTO: 'auto'
});

const POPOVER_MODE = Object.freeze({
    JS_MODAL: 'js-modal',
    RN_MODAL: 'modal',
    TOOLTIP: 'view'
});

class Popover extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            requestedContentSize: {},
            forcedContentSize: {},
            viewLargerThanDisplayArea: {
                width: false,
                height: false
            },
            anchorPoint: new Point(0, 0),
            popoverOrigin: {},
            // forcedHeight: null,
            shiftedDisplayArea: null,
            defaultDisplayArea: null,
            placement: PLACEMENT_OPTIONS.AUTO,
            isAwaitingShow: true,
            visible: false, // Modal
            showing: false, // Popover itself
            fromRect: null,
            animatedValues: {
                scale: new Animated.Value(0),
                translate: new Animated.ValueXY(),
                fade: new Animated.Value(0),
                translateArrow: new Animated.ValueXY()
            },
            debug: false
        };

        this.measureContent = this.measureContent.bind(this);
        this.animateIn = this.animateIn.bind(this);
    }

    debug(line, obj) {
        const { debug } = this.state;
        if (DEBUG || debug) { console.log(line + (obj ? `: ${JSON.stringify(obj)}` : '')); }
    }

    getDisplayAreaOffset(displayArea, callback) {
        // If we aren't shoowing in RN Modal, we have no guarantee that we have the whole screen, so need to adapt to that
        const { mode } = this.props;
        if (mode !== POPOVER_MODE.RN_MODAL) {
            getRectForRef(this.containerRef, (rect) => callback(new Point(rect.x, rect.y + FIX_SHIFT)));
        } else {
            callback(new Point(0, 0));
        }
    }

    setDefaultDisplayArea(evt) {
        const { defaultDisplayArea, fromRect: rect } = this.state;
        const newDisplayArea = new Rect(evt.nativeEvent.layout.x + 10, evt.nativeEvent.layout.y + 10, evt.nativeEvent.layout.width - 20, evt.nativeEvent.layout.height - 20);
        // When the popover is closing and the display area's onLayout event is called, the width/height values may be zero
        // which causes a bad display area for the first mount when the popover re-opens
        const isValidDisplayArea = newDisplayArea.width > 0 && newDisplayArea.height > 0;
        if ((!defaultDisplayArea || rectChanged(defaultDisplayArea, newDisplayArea)) && isValidDisplayArea) {
            this.debug('setDefaultDisplayArea - newDisplayArea', newDisplayArea);
            if (!this.skipNextDefaultDisplayArea) {
                this.getDisplayAreaOffset(newDisplayArea, (displayAreaOffset) => {
                    this.debug('setDefaultDisplayArea - displayAreaOffset', displayAreaOffset);
                    this.setState({ defaultDisplayArea: newDisplayArea, displayAreaOffset }, () => {
                        this.calculateRect((fromRect) => {
                            this.debug('setDefaultDisplayArea (inside calculateRect callback) - fromRect', fromRect);
                            this.debug('setDefaultDisplayArea (inside calculateRect callback) - getDisplayArea()', this.getDisplayArea());
                            this.debug('setDefaultDisplayArea (inside calculateRect callback) - displayAreaStore', this.displayAreaStore);
                            if (rectChanged(fromRect, rect)
                                || rectChanged(this.getDisplayArea(), this.displayAreaStore)) {
                                this.displayAreaStore = this.getDisplayArea();
                                this.debug('setDefaultDisplayArea (inside calculateRect callback) - Triggering state update');
                                this.setState({ fromRect }, () => {
                                    this.handleGeomChange();
                                    this.waitForResizeToFinish = false;
                                });
                            }
                        });
                    });
                });
            }
            if (this.skipNextDefaultDisplayArea) this.debug('setDefaultDisplayArea - Skipping first because isLandscape');
            this.skipNextDefaultDisplayArea = false;
        }
    }

    keyboardDidShow(e) {
        this.debug(`keyboardDidShow - keyboard height: ${e.endCoordinates.height}`);
        this.shiftForKeyboard(e.endCoordinates.height);
    }

    keyboardDidHide() {
        this.debug('keyboardDidHide');

        // On android, the keyboard update causes a default display area change, so no need to manually trigger
        this.setState({ shiftedDisplayArea: null }, () => isIOS && this.handleGeomChange());
    }

    shiftForKeyboard(keyboardHeight) {
        const displayArea = this.getDisplayArea();

        const absoluteVerticalCutoff = Dimensions.get('window').height - keyboardHeight - (isIOS ? 10 : 40);
        const combinedY = Math.min(displayArea.height + displayArea.y, absoluteVerticalCutoff);

        this.setState({
            shiftedDisplayArea: {
                x: displayArea.x,
                y: displayArea.y,
                width: displayArea.width,
                height: combinedY - displayArea.y
            }
        }, () => this.handleGeomChange());
    }

    componentDidMount() {
        // This is used so that when the device is rotating or the viewport is expanding for any other reason,
        //  we can suspend updates due to content changes until we are finished calculating the new display
        //  area and rect for the new viewport size
        // This makes the recalc on rotation much faster
        this.waitForResizeToFinish = false;
        const { isVisible, fromView, mode } = this.props;
        // Show popover if isVisible is initially true
        if (isVisible) {
            if (!Popover.isShowingInModal) {
                setTimeout(() => this.calculateRect((fromRect) => (fromRect || !fromView) && this.setState({ fromRect, isAwaitingShow: true, visible: true })), 0);
                if (mode === POPOVER_MODE.RN_MODAL) Popover.isShowingInModal = true;
            } else {
                // console.warn(MULTIPLE_POPOVER_WARNING);
            }
        }

        Dimensions.addEventListener('change', this.handleResizeEvent);
    }

    componentWillUnmount() {
        // This method performs a setState action when unmounted, require a flag to prevent, it's named unmounted
        this.unmounted = true;

        const { visible } = this.state;
        const { onCloseStart, onCloseComplete } = this.props;
        if (visible) {
            this.animateOut();
        } else {
            setTimeout(onCloseStart);
            setTimeout(onCloseComplete);
        }

        Dimensions.removeEventListener('change', this.handleResizeEvent);
    }

    // First thing called when device rotates
    handleResizeEvent = (change) => {
        const { isVisible } = this.props;
        this.debug('handleResizeEvent - New Dimensions', change);
        if (isVisible) {
            this.waitForResizeToFinish = true;
        }
    }

    measureContent(requestedContentSize) {
        const { fromView, mode, onOpenStart } = this.props;
        const { isAwaitingShow, fromRect, requestedContentSize: requestState } = this.state;
        if (!requestedContentSize.width) console.warn("Popover Warning - Can't Show - The Popover content has a width of 0, so there is nothing to present.");
        if (!requestedContentSize.height) console.warn("Popover Warning - Can't Show - The Popover content has a height of 0, so there is nothing to present.");
        if (this.waitForResizeToFinish) this.debug('measureContent - Waiting for resize to finish');

        if (requestedContentSize.width && requestedContentSize.height && !this.waitForResizeToFinish) {
            if (isAwaitingShow) {
                if ((fromView && !fromRect) || !this.getDisplayArea()) {
                    this.debug(`measureContent - Waiting ${this.getDisplayArea() ? 'for Rect' : 'for Display Area'} - requestedContentSize`, requestedContentSize);
                    setTimeout(() => this.measureContent(requestedContentSize), 100);
                } else {
                    this.debug('measureContent - Showing Popover - requestedContentSize', requestedContentSize);
                    const geom = this.computeGeometry({ requestedContentSize });
                    this.debug('measureContent - Showing Popover - geom', geom);

                    // If the view initially overflowed the display area, wait one more render cycle to test-render it within the display area to get
                    //  final calculations for popoverOrigin before show
                    if (geom.viewLargerThanDisplayArea.width || geom.viewLargerThanDisplayArea.height) {
                        this.debug('measureContent - Delaying showing popover because viewLargerThanDisplayArea');
                        this.setState(Object.assign(geom, { requestedContentSize }));
                    } else {
                        this.debug('measureContent - Showing Popover - Animating In');

                        // If showing in a modal, the onOpenStart callback will be called from the modal onShow callback
                        if (mode !== POPOVER_MODE.RN_MODAL) { setTimeout(onOpenStart); }

                        this.setState(Object.assign(geom, { requestedContentSize, isAwaitingShow: false }), this.animateIn);
                    }
                }
            } else if (requestedContentSize.width !== requestState.width || requestedContentSize.height !== requestState.height) {
                // In the case of an animation within the popover that affects the popover size, this function will be called frequently throughout the duration
                //   of the animation.  This will continuously schedule and then cancel the timeout until the last time this is called when the animation is complete.
                // If this method is only called once, we are only introducing a 50ms lag into the process, so shouldn't be noticeable
                clearTimeout(this.measureContentTimeout);
                this.measureContentTimeout = setTimeout(() => {
                    this.debug(`measureContent - new requestedContentSize: ${JSON.stringify(requestedContentSize)} (used to be ${JSON.stringify(requestState)})`);
                    this.handleGeomChange(requestedContentSize);
                }, 50);
            }
        }
    }

    computeGeometry({
        requestedContentSize, placement, fromRect, displayArea
    }) {
        const { placement: placementProp, fromRect: rectProp } = this.props;
        const { fromRect: rectState } = this.state;
        placement = placement || placementProp;
        fromRect = fromRect || ({ ...rectProp || rectState });
        displayArea = displayArea || ({ ...this.getDisplayArea() });

        this.debug('computeGeometry - displayArea', displayArea);
        this.debug('computeGeometry - fromRect', fromRect);

        let newGeom = null;

        if (fromRect && isRect(fromRect)) {
            // check to see if fromRect is outside of displayArea, and adjust if it is
            if (fromRect.x > displayArea.x + displayArea.width) fromRect.x = displayArea.x + displayArea.width;
            if (fromRect.y > displayArea.y + displayArea.height) fromRect.y = displayArea.y + displayArea.height;
            if (fromRect.x < 0) fromRect.x = -1 * fromRect.width;
            if (fromRect.y < 0) fromRect.y = -1 * fromRect.height;

            const options = {
                displayArea,
                fromRect,
                requestedContentSize
            };

            switch (placement) {
                case PLACEMENT_OPTIONS.TOP:
                    newGeom = this.computeTopGeometry(options);
                    break;
                case PLACEMENT_OPTIONS.BOTTOM:
                    newGeom = this.computeBottomGeometry(options);
                    break;
                case PLACEMENT_OPTIONS.LEFT:
                    newGeom = this.computeLeftGeometry(options);
                    break;
                case PLACEMENT_OPTIONS.RIGHT:
                    newGeom = this.computeRightGeometry(options);
                    break;
                default:
                    newGeom = this.computeAutoGeometry(options);
            }

            // If the popover will be restricted and the view that the popover is showing from is sufficiently large, try to show the popover inside the view
            if (newGeom.viewLargerThanDisplayArea.width || newGeom.viewLargerThanDisplayArea.height) {
                const fromRectHeightVisible = fromRect.y < displayArea.y
                    ? fromRect.height - (displayArea.y - fromRect.y)
                    : displayArea.y + displayArea.height - fromRect.y;
                if (fromRect.width > requestedContentSize.width && fromRectHeightVisible > requestedContentSize.height) {
                    const preferedX = Math.max(fromRect.x + 10, fromRect.x + (fromRect.width - requestedContentSize.width) / 2);
                    const preferedY = Math.max(fromRect.y + 10, fromRect.y + (fromRect.height - requestedContentSize.height) / 2);

                    let constrainedX = Math.max(preferedX, displayArea.x);
                    if (constrainedX + requestedContentSize.width > displayArea.x + displayArea.width) { constrainedX = displayArea.x + displayArea.width - requestedContentSize.width; }

                    let constrainedY = Math.max(preferedY, displayArea.y);
                    if (constrainedY + requestedContentSize.height > displayArea.y + displayArea.height) { constrainedY = displayArea.y + displayArea.height - requestedContentSize.height; }

                    const forcedContentSize = {
                        width: Math.min(fromRect.width - 20, displayArea.width),
                        height: Math.min(fromRect.height - 20, displayArea.height)
                    };

                    newGeom = {
                        popoverOrigin: new Point(constrainedX, constrainedY),
                        anchorPoint: new Point(fromRect.x + (fromRect.width / 2), fromRect.y + (fromRect.height / 2)),
                        forcedContentSize,
                        viewLargerThanDisplayArea: {
                            width: requestedContentSize.width > forcedContentSize.width,
                            height: requestedContentSize.height > forcedContentSize.height
                        },
                        showArrow: false
                    };
                } else {
                    // If we can't fit inside or outside the fromRect, show the popover centered on the screen
                    newGeom = null;
                }
            }
        }

        if (!newGeom) {
            const minY = displayArea.y;
            const minX = displayArea.x;
            const preferedY = (displayArea.height - requestedContentSize.height) / 2 + displayArea.y;
            const preferedX = (displayArea.width - requestedContentSize.width) / 2 + displayArea.x;

            newGeom = {
                popoverOrigin: new Point(Math.max(minX, preferedX), Math.max(minY, preferedY)),
                anchorPoint: new Point(displayArea.width / 2 + displayArea.x, displayArea.height / 2 + displayArea.y),
                forcedContentSize: {
                    width: displayArea.width,
                    height: displayArea.height
                },
                viewLargerThanDisplayArea: {
                    width: preferedX < minX - 1,
                    height: preferedY < minY - 1
                },
                showArrow: false
            };
        }

        return newGeom;
    }

    computeTopGeometry({ displayArea, fromRect, requestedContentSize }) {
        const minY = displayArea.y;
        const arrowSize = this.getArrowSize(PLACEMENT_OPTIONS.TOP);
        const preferedY = fromRect.y - requestedContentSize.height - arrowSize.height;

        const forcedContentSize = {
            height: (fromRect.y - arrowSize.height - displayArea.y),
            width: displayArea.width
        };

        const viewLargerThanDisplayArea = {
            height: preferedY < minY - 1,
            width: requestedContentSize.width > displayArea.width + 1
        };

        const viewWidth = viewLargerThanDisplayArea.width ? forcedContentSize.width : requestedContentSize.width;

        const maxX = displayArea.x + displayArea.width - viewWidth;
        const minX = displayArea.x;
        const preferedX = fromRect.x + (fromRect.width - viewWidth) / 2;

        const popoverOrigin = new Point(
            Math.min(maxX, Math.max(minX, preferedX)),
            Math.max(minY, preferedY)
        );

        const anchorPoint = new Point(fromRect.x + fromRect.width / 2.0, fromRect.y);

        // Make sure the arrow isn't cut off
        anchorPoint.x = Math.max(anchorPoint.x, arrowSize.width / 2 + this.getBorderRadius());
        anchorPoint.x = Math.min(anchorPoint.x, displayArea.x + displayArea.width - (arrowSize.width / 2) - this.getBorderRadius());

        return {
            popoverOrigin,
            anchorPoint,
            placement: PLACEMENT_OPTIONS.TOP,
            forcedContentSize,
            viewLargerThanDisplayArea,
            showArrow: true
        };
    }

    computeBottomGeometry({ displayArea, fromRect, requestedContentSize }) {
        const { skipAndroidStatusBar } = this.props;
        const arrowSize = this.getArrowSize(PLACEMENT_OPTIONS.BOTTOM);
        const preferedY = isIOS ? fromRect.y + fromRect.height + arrowSize.height : skipAndroidStatusBar ? fromRect.y + fromRect.height + arrowSize.height - StatusBar.currentHeight : fromRect.y + fromRect.height + arrowSize.height;

        const forcedContentSize = {
            height: displayArea.y + displayArea.height - preferedY,
            width: displayArea.width
        };

        const viewLargerThanDisplayArea = {
            height: preferedY + requestedContentSize.height > displayArea.y + displayArea.height + 1,
            width: requestedContentSize.width > displayArea.width + 1
        };

        const viewWidth = viewLargerThanDisplayArea.width ? forcedContentSize.width : requestedContentSize.width;

        const maxX = displayArea.x + displayArea.width - viewWidth;
        const minX = displayArea.x;
        const preferedX = fromRect.x + (fromRect.width - viewWidth) / 2;

        const popoverOrigin = new Point(
            Math.min(maxX, Math.max(minX, preferedX)),
            preferedY
        );

        const anchorPoint = new Point(fromRect.x + fromRect.width / 2.0, isIOS ? fromRect.y + fromRect.height : skipAndroidStatusBar ? fromRect.y + fromRect.height - StatusBar.currentHeight : fromRect.y + fromRect.height);

        // Make sure the arrow isn't cut off
        anchorPoint.x = Math.max(anchorPoint.x, arrowSize.width / 2 + this.getBorderRadius());
        anchorPoint.x = Math.min(anchorPoint.x, displayArea.x + displayArea.width - (arrowSize.width / 2) - this.getBorderRadius());

        return {
            popoverOrigin,
            anchorPoint,
            placement: PLACEMENT_OPTIONS.BOTTOM,
            forcedContentSize,
            viewLargerThanDisplayArea,
            showArrow: true
        };
    }

    getPolarity() {
        return I18nManager.isRTL ? -1 : 1;
    }

    computeLeftGeometry({ displayArea, fromRect, requestedContentSize }) {
        const arrowSize = this.getArrowSize(PLACEMENT_OPTIONS.LEFT);

        const forcedContentSize = {
            height: displayArea.height,
            width: fromRect.x - displayArea.x - arrowSize.width
        };

        const viewLargerThanDisplayArea = {
            height: requestedContentSize.height > displayArea.height + 1,
            width: requestedContentSize.width > fromRect.x - displayArea.x - arrowSize.width + 1
        };

        const viewWidth = viewLargerThanDisplayArea.width ? forcedContentSize.width : requestedContentSize.width;
        const viewHeight = viewLargerThanDisplayArea.height ? forcedContentSize.height : requestedContentSize.height;

        const preferedX = fromRect.x - viewWidth - arrowSize.width;

        const preferedY = fromRect.y + (fromRect.height - viewHeight) / 2;
        const minY = displayArea.y;
        const maxY = (displayArea.height - viewHeight) + displayArea.y;

        const popoverOrigin = new Point(
            preferedX,
            Math.min(Math.max(minY, preferedY), maxY)
        );

        const anchorPoint = new Point(fromRect.x, fromRect.y + fromRect.height / 2.0);

        // Make sure the arrow isn't cut off
        anchorPoint.y = Math.max(anchorPoint.y, arrowSize.height / 2 + this.getBorderRadius());
        anchorPoint.y = Math.min(anchorPoint.y, displayArea.y + displayArea.height - (arrowSize.height / 2) - this.getBorderRadius());

        return {
            popoverOrigin,
            anchorPoint,
            placement: PLACEMENT_OPTIONS.LEFT,
            forcedContentSize,
            viewLargerThanDisplayArea,
            showArrow: true
        };
    }

    computeRightGeometry({ displayArea, fromRect, requestedContentSize }) {
        const arrowSize = this.getArrowSize(PLACEMENT_OPTIONS.RIGHT);
        const horizontalSpace = displayArea.x + displayArea.width - (fromRect.x + fromRect.width) - arrowSize.width;

        const forcedContentSize = {
            height: displayArea.height,
            width: horizontalSpace
        };

        const viewLargerThanDisplayArea = {
            height: requestedContentSize.height > displayArea.height + 1,
            width: requestedContentSize.width > horizontalSpace + 1
        };

        const viewHeight = viewLargerThanDisplayArea.height ? forcedContentSize.height : requestedContentSize.height;

        const preferedX = fromRect.x + fromRect.width + arrowSize.width;

        const preferedY = fromRect.y + (fromRect.height - viewHeight) / 2;
        const minY = displayArea.y;
        const maxY = (displayArea.height - viewHeight) + displayArea.y;

        const popoverOrigin = new Point(
            preferedX,
            Math.min(Math.max(minY, preferedY), maxY)
        );

        const anchorPoint = new Point(fromRect.x + fromRect.width, fromRect.y + fromRect.height / 2.0);

        // Make sure the arrow isn't cut off
        anchorPoint.y = Math.max(anchorPoint.y, arrowSize.height / 2 + this.getBorderRadius());
        anchorPoint.y = Math.min(anchorPoint.y, displayArea.y + displayArea.height - (arrowSize.height / 2) - this.getBorderRadius());

        return {
            popoverOrigin,
            anchorPoint,
            placement: PLACEMENT_OPTIONS.RIGHT,
            forcedContentSize,
            viewLargerThanDisplayArea,
            showArrow: true
        };
    }

    computeAutoGeometry({ displayArea, requestedContentSize, fromRect }) {
        const { placement: placementState } = this.state;
        let arrowSize = this.getArrowSize(PLACEMENT_OPTIONS.LEFT);
        const possiblePlacements = [];
        if (fromRect.x - displayArea.x - arrowSize.width >= requestedContentSize.width) { // We could fit it on the left side
            possiblePlacements.push(PLACEMENT_OPTIONS.LEFT);
            return this.computeGeometry({
                requestedContentSize, placement: PLACEMENT_OPTIONS.LEFT, fromRect, displayArea
            });
        }
        // We could fit it on the right side
        if (displayArea.x + displayArea.width - (fromRect.x + fromRect.width) - arrowSize.width >= requestedContentSize.width) { possiblePlacements.push(PLACEMENT_OPTIONS.RIGHT); }

        arrowSize = this.getArrowSize(PLACEMENT_OPTIONS.TOP);

        this.debug('computeAutoGeometry - possiblePlacements', possiblePlacements);

        // Keep same placement if possible
        if (possiblePlacements.length === 2 && placementState !== PLACEMENT_OPTIONS.AUTO && possiblePlacements.indexOf(placementState) !== -1) {
            const geom = this.computeGeometry({
                requestedContentSize, placement: placementState, fromRect, displayArea
            });
            if (!geom.viewLargerThanDisplayArea.width) return geom;
        }
        if (possiblePlacements.length === 1) {
            const geom = this.computeGeometry({
                requestedContentSize, placement: possiblePlacements[0], fromRect, displayArea
            });
            if (!geom.viewLargerThanDisplayArea.width) return geom;
        }

        if (placementState === PLACEMENT_OPTIONS.TOP || placementState === PLACEMENT_OPTIONS.BOTTOM) {
            return this.computeGeometry({
                requestedContentSize, placement: placementState, fromRect, displayArea
            });
        }

        // We could fit it on the top or bottom, need to figure out which is better

        const topSpace = fromRect.y - displayArea.y;
        const bottomSpace = displayArea.y + displayArea.height - (fromRect.y + fromRect.height);
        return (topSpace - 50) > bottomSpace ? this.computeGeometry({
            requestedContentSize, placement: PLACEMENT_OPTIONS.TOP, fromRect, displayArea
        }) : this.computeGeometry({
            requestedContentSize, placement: PLACEMENT_OPTIONS.BOTTOM, fromRect, displayArea
        });
    }

    getArrowSize(placement) {
        const { arrowStyle } = this.props;
        const size = new Size(arrowStyle.width || DEFAULT_ARROW_SIZE.width, arrowStyle.height || DEFAULT_ARROW_SIZE.height);
        switch (placement) {
            case PLACEMENT_OPTIONS.LEFT:
            case PLACEMENT_OPTIONS.RIGHT:
                return new Size(size.height, size.width);
            default:
                return size;
        }
    }

    getArrowRotation(placement) {
        switch (placement) {
            case PLACEMENT_OPTIONS.BOTTOM:
                return '180deg';
            case PLACEMENT_OPTIONS.LEFT:
                return `${this.getPolarity() * -90}deg`;
            case PLACEMENT_OPTIONS.RIGHT:
                return `${this.getPolarity() * 90}deg`;
            default:
                return '0deg';
        }
    }

    getArrowDynamicStyle() {
        const { arrowWidth: width, arrowHeight: height } = this.getCalculatedArrowDims();

        // Create the arrow from a rectangle with the appropriate borderXWidth set
        // A rotation is then applied dependending on the placement
        // Also make it slightly bigger
        // to fix a visual artifact when the popover is animated with a scale
        return {
            width,
            height,
            borderTopWidth: height / 2,
            borderRightWidth: width / 2,
            borderBottomWidth: height / 2,
            borderLeftWidth: width / 2,
        };
    }

    getCalculatedArrowDims() {
        const { arrowStyle } = this.props;
        const arrowWidth = (arrowStyle.width || DEFAULT_ARROW_SIZE.width) + 2;
        const arrowHeight = (arrowStyle.height || DEFAULT_ARROW_SIZE.height) * 2 + 2;
        return { arrowWidth, arrowHeight };
    }

    getBorderRadius() {
        const { popoverStyle } = this.props;
        if (popoverStyle.borderRadius === 0) return 0;
        return popoverStyle.borderRadius || DEFAULT_BORDER_RADIUS;
    }

    getArrowTranslateLocation(translatePoint = null) {
        const {
            anchorPoint, placement, forcedContentSize, viewLargerThanDisplayArea, requestedContentSize
        } = this.state;
        const { arrowWidth, arrowHeight } = this.getCalculatedArrowDims();
        const viewWidth = viewLargerThanDisplayArea.width ? forcedContentSize.width : requestedContentSize.width || 0;
        const viewHeight = viewLargerThanDisplayArea.height ? forcedContentSize.height : requestedContentSize.height || 0;

        let arrowX = anchorPoint.x - arrowWidth / 2;
        let arrowY = anchorPoint.y - arrowHeight / 2;

        // Ensuring that the arrow does not go outside the bounds of the content box during a move
        if (translatePoint) {
            if (placement === PLACEMENT_OPTIONS.LEFT || placement === PLACEMENT_OPTIONS.RIGHT) {
                if (translatePoint.y > (arrowY - this.getBorderRadius())) {
                    arrowY = translatePoint.y + this.getBorderRadius();
                } else if (viewHeight && translatePoint.y + viewHeight < arrowY + arrowHeight) {
                    arrowY = translatePoint.y + viewHeight - arrowHeight - this.getBorderRadius();
                }
            } else if (placement === PLACEMENT_OPTIONS.TOP || placement === PLACEMENT_OPTIONS.BOTTOM) {
                if (translatePoint.x > arrowX - this.getBorderRadius()) {
                    arrowX = translatePoint.x + this.getBorderRadius();
                } else if (viewWidth && translatePoint.x + viewWidth < arrowX + arrowWidth) {
                    arrowX = translatePoint.x + viewWidth - arrowWidth - this.getBorderRadius();
                }
            }
        }
        return new Point(arrowX, (FIX_SHIFT * 2) /* Temp fix for useNativeDriver issue */ + arrowY);
    }

    getTranslateOrigin() {
        const {
            forcedContentSize, viewLargerThanDisplayArea, requestedContentSize, popoverOrigin, anchorPoint
        } = this.state;

        const popoverWidth = viewLargerThanDisplayArea.width ? forcedContentSize.width : requestedContentSize.width || 0;
        const popoverHeight = viewLargerThanDisplayArea.height ? forcedContentSize.height : requestedContentSize.height || 0;
        const popoverCenter = new Point(popoverOrigin.x + (popoverWidth / 2), popoverOrigin.y + (popoverHeight / 2));
        const shiftHorizantal = anchorPoint.x - popoverCenter.x;
        const shiftVertical = anchorPoint.y - popoverCenter.y;

        this.debug('getTranslateOrigin - popoverOrigin', popoverOrigin);
        this.debug('getTranslateOrigin - popoverSize', { width: popoverWidth, height: popoverHeight });
        this.debug('getTranslateOrigin - anchorPoint', anchorPoint);
        this.debug('getTranslateOrigin - shift', { hoizontal: shiftHorizantal, vertical: shiftVertical });

        return new Point(popoverOrigin.x + shiftHorizantal, popoverOrigin.y + shiftVertical);
    }

    getDisplayArea() {
        const { shiftedDisplayArea, defaultDisplayArea } = this.state;
        const { displayArea } = this.props;
        return shiftedDisplayArea || displayArea || defaultDisplayArea;
    }

    componentDidUpdate(prevProps) {
        // Make sure a value we care about has actually changed
        const { props } = this;
        const { state } = this;
        const importantProps = ['isVisible', 'fromRect', 'displayArea', 'verticalOffset', 'placement'];
        if (!importantProps.reduce((acc, key) => acc || props[key] !== prevProps[key], false)) { return; }

        const willBeVisible = props.isVisible;

        if (willBeVisible !== prevProps.isVisible) {
            if (willBeVisible) {
                // We want to start the show animation only when contentSize is known
                // so that we can have some logic depending on the geometry
                if (!Popover.isShowingInModal) {
                    this.calculateRect((fromRect) => this.setState({ fromRect, isAwaitingShow: true, visible: true }));
                    if (props.mode === POPOVER_MODE.RN_MODAL) Popover.isShowingInModal = true;
                } else {
                    // console.warn(MULTIPLE_POPOVER_WARNING);
                }
                this.debug('componentWillReceiveProps - Awaiting popover show');
            } else if (state.visible) {
                if (state.showing) { this.animateOut(); } else { this.animateOutAfterShow = true; }
                this.debug('componentWillReceiveProps - Hiding popover');
            } else {
                setTimeout(props.onCloseStart);
                setTimeout(props.onCloseComplete);
                this.debug('componentWillReceiveProps - Popover never shown');
            }
        } else if (willBeVisible) {
            this.calculateRect((fromRect) => {
                if (rectChanged(fromRect, state.fromRect)
                    || (props.displayArea && !prevProps.displayArea)
                    || rectChanged(props.displayArea, prevProps.displayArea)
                    || rectChanged(this.getDisplayArea(), this.displayAreaStore)) {
                    this.displayAreaStore = this.getDisplayArea();
                    this.setState({ fromRect }, () => this.handleGeomChange());
                }
            });
        }
    }

    calculateRect(callback) {
        const { props } = this;
        const { state } = this;
        const initialRect = state.fromRect || new Rect(0, 0, 0, 0);
        const displayArea = props.displayArea || this.getDisplayArea();
        if (props.fromDynamicRect) {
            runAfterChange((callback_) => callback_(props.fromDynamicRect(displayArea.width, displayArea.height)), initialRect, () => {
                callback({ fromRect: props.fromDynamicRect(displayArea.width, displayArea.height) });
            });
        } else if (props.fromView) {
            const verticalOffset = props.verticalOffset + (state.displayAreaOffset ? -1 * state.displayAreaOffset.y : 0);
            const horizontalOffset = state.displayAreaOffset ? -1 * state.displayAreaOffset.x : 0;
            waitForNewRect(props.fromView, initialRect, (rect) => {
                callback(new Rect(rect.x + horizontalOffset, rect.y + verticalOffset, rect.width, rect.height));
            });
        } else {
            callback(props.fromRect);
        }
    }

    handleGeomChange(requestedContentSize) {
        const {
            forcedContentSize, popoverOrigin, animatedValues, requestedContentSize: requestedState
        } = this.state;
        const { animation = true } = this.props;
        requestedContentSize = requestedContentSize || ({ ...requestedState });

        this.debug('handleGeomChange - requestedContentSize: ', requestedContentSize);

        // handleGeomChange may be called more than one times before the first has a chance to finish,
        //  so we use updateCount to make sure that we only trigger an animation on the last one
        if (!this.updatesCount || this.updatesCount < 0) this.updateCount = 0;
        this.updateCount++;

        const geom = this.computeGeometry({ requestedContentSize });

        if (animation && (pointChanged(geom.popoverOrigin, popoverOrigin) || rectChanged(geom.forcedContentSize, forcedContentSize))) {
            this.setState(Object.assign(geom, { requestedContentSize }), () => {
                if (this.updateCount <= 1) {
                    this.updateCount--;
                    const moveTo = new Point(geom.popoverOrigin.x, geom.popoverOrigin.y);
                    this.debug('handleGeomChange - Triggering popover move to', moveTo);
                    this.animateTo({
                        values: animatedValues,
                        fade: 1,
                        scale: 1,
                        translatePoint: moveTo,
                        easing: Easing.inOut(Easing.quad)
                    });
                }
            });
        }
    }

    animateOut() {
        const { props, state } = this;
        setTimeout(props.onCloseStart);
        this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener && this.keyboardDidHideListener.remove();

        // Animation callback may or may not get called if animation is cut short, so calling this a bit early for safety
        if (props.mode === POPOVER_MODE.RN_MODAL) Popover.isShowingInModal = false;

        if (this.unmounted) {
            return;
        }
        this.setState({ shiftedDisplayArea: null, showing: false });

        this.animateTo({
            values: state.animatedValues,
            fade: 0,
            scale: 0,
            translatePoint: this.getTranslateOrigin(),
            callback: () => this.setState({ visible: false, forcedContentSize: {} }, () => {
                // If showing in an RN modal, the onCloseComplete callback will be called from the Modal onDismiss callback (on iOS only)
                if (props.mode !== POPOVER_MODE.RN_MODAL || !isIOS) { props.onCloseComplete(); }
            }),
            easing: Easing.inOut(Easing.quad)
        });
    }

    animateIn() {
        const { state, props } = this;
        const values = state.animatedValues;

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
        this.displayAreaStore = this.getDisplayArea();

        // Should grow from anchor point
        const translateStart = this.getTranslateOrigin();
        translateStart.y += (FIX_SHIFT * 2); // Temp fix for useNativeDriver issue
        values.translate.setValue(translateStart);
        const translatePoint = new Point(state.popoverOrigin.x, state.popoverOrigin.y);
        values.translateArrow.setValue(this.getArrowTranslateLocation(translatePoint));

        this.animateTo({
            values,
            fade: 1,
            scale: 1,
            translatePoint,
            easing: Easing.out(Easing.back()),
            callback: () => {
                this.setState({ showing: true });
                setTimeout(props.onOpenComplete);
                setTimeout(() => getRectForRef(this.popoverRef, (rect) => this.debug('animateIn - onOpenComplete - Calculated Popover Rect', rect)));
                if (this.animateOutAfterShow) {
                    this.animateOut();
                    this.animateOutAfterShow = false;
                }
            }
        });
    }

    animateTo({
        fade, translatePoint, scale, callback, easing, values
    }) {
        const { props } = this;
        const commonConfig = {
            duration: 300,
            easing,
            useNativeDriver: true,
            ...props.animationConfig
        };

        if (this.animating) {
            setTimeout(() => this.animateTo?.apply(this, arguments), 100);
            return;
        }

        const newArrowLocation = this.getArrowTranslateLocation(translatePoint);

        translatePoint.y += (FIX_SHIFT * 2); // Temp fix for useNativeDriver issue

        if (!fade && fade !== 0) { console.log('Popover: Fade value is null'); return; }
        if (!isPoint(translatePoint)) { console.log('Popover: Translate Point value is null'); return; }
        if (!scale && scale !== 0) { console.log('Popover: Scale value is null'); return; }
        this.animating = true;
        Animated.parallel([
            Animated.timing(values.fade, {
                ...commonConfig,
                toValue: fade,
                useNativeDriver: true
            }),
            Animated.timing(values.translate, {
                ...commonConfig,
                toValue: translatePoint
            }),
            Animated.timing(values.scale, {
                ...commonConfig,
                toValue: scale
            }),
            Animated.timing(values.translateArrow, {
                ...commonConfig,
                toValue: newArrowLocation
            })
        ]).start(() => {
            this.animating = false;
            if (callback) callback();
        });
    }

    renderDefault = () => {
        const { content, contentStyle, textContentStyle } = this.props;
        return (
            <View style={[styles.content, contentStyle]}>
                <Text.Title color={Colors.black_01} style={textContentStyle}>{content}</Text.Title>
            </View>
        );
    };

    render() {
        const {
            placement, animatedValues, forcedContentSize, showArrow, visible
        } = this.state;
        const {
            popoverStyle, arrowStyle, backgroundStyle: background, mode, onRequestClose, children, onOpenStart, onCloseComplete, content
        } = this.props;
        const { arrowWidth, arrowHeight } = this.getCalculatedArrowDims();

        const arrowScale = animatedValues.scale.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        });

        const arrowViewStyle = {
            position: 'absolute',
            top: 0,
            ...(I18nManager.isRTL ? { right: 0 } : { left: 0 }),
            width: arrowWidth,
            height: arrowHeight,
            transform: [
                { translateX: animatedValues.translateArrow.x },
                { translateY: animatedValues.translateArrow.y },
                { scale: arrowScale },
            ]
        };

        const arrowInnerStyle = [
            styles.arrow,
            this.getArrowDynamicStyle(),
            {
                borderTopColor: arrowStyle.backgroundColor || popoverStyle.backgroundColor || styles.popoverContent.backgroundColor,
                transform: [
                    { rotate: this.getArrowRotation(placement) }
                ]
            }
        ];

        // Temp fix for useNativeDriver issue
        const backgroundShift = animatedValues.fade.interpolate({
            inputRange: [0, 0.0001, 1],
            outputRange: [0, FIX_SHIFT, FIX_SHIFT]
        });

        const backgroundStyle = {
            ...styles.background,
            transform: [
                { translateY: backgroundShift }
            ],
            ...background
        };

        const containerStyle = {
            ...styles.container,
            opacity: animatedValues.fade
        };

        const popoverViewStyle = {
            maxWidth: forcedContentSize.width,
            maxHeight: forcedContentSize.height,
            position: 'absolute',
            ...styles.dropShadow,
            ...styles.popoverContent,
            ...popoverStyle,
            transform: [
                { translateX: animatedValues.translate.x },
                { translateY: animatedValues.translate.y },
                { scale: animatedValues.scale },
                { perspective: 1000 }
            ],
        };

        const contentView = (
            <View pointerEvents="box-none" style={[styles.container, { left: 0 }]} ref={(ref) => this.containerRef = ref}>
                <SafeAreaView
                    pointerEvents="none"
                    style={{
                        position: 'absolute', top: FIX_SHIFT, left: 0, right: 0, bottom: 0
                    }}
                >
                    <TouchableWithoutFeedback style={{ flex: 1 }} onLayout={(evt) => this.setDefaultDisplayArea(evt)}>
                        <View style={{ flex: 1 }} />
                    </TouchableWithoutFeedback>
                </SafeAreaView>

                <Animated.View pointerEvents="box-none" style={containerStyle}>
                    {mode !== POPOVER_MODE.TOOLTIP && (
                        <TouchableWithoutFeedback onPress={onRequestClose}>
                            <Animated.View style={backgroundStyle} />
                        </TouchableWithoutFeedback>
                    )}

                    <View pointerEvents="box-none" style={{ top: 0, left: 0 }}>

                        <Animated.View
                            style={popoverViewStyle}
                            ref={(ref) => this.popoverRef = ref}
                            onLayout={(evt) => {
                                const layout = { ...evt.nativeEvent.layout };
                                setTimeout(() => this.measureContent(layout), 10);
                            }}
                        >
                            {content ? this.renderDefault() : children}
                        </Animated.View>

                        {showArrow
                            && (
                                <Animated.View style={arrowViewStyle}>
                                    <View style={arrowInnerStyle} />
                                </Animated.View>
                            )}
                    </View>
                </Animated.View>
            </View>
        );

        if (mode === POPOVER_MODE.RN_MODAL) {
            return (
                <Modal
                    transparent
                    supportedOrientations={['portrait', 'portrait-upside-down', 'landscape']}
                    hardwareAccelerated
                    visible={visible}
                    onShow={onOpenStart}
                    onDismiss={onCloseComplete}
                    onRequestClose={onRequestClose}
                >
                    {contentView}
                </Modal>
            );
        } if (visible) {
            return contentView;
        }
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
        top: -1 * FIX_SHIFT,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        backgroundColor: 'transparent'
    },
    background: {
        top: 0,
        bottom: FIX_SHIFT,
        left: 0,
        right: 0,
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    contentContainer: {
        flexDirection: 'column',
    },
    popoverContainer: {
        position: 'absolute',
        zIndex: 1000
    },
    popoverContent: {
        backgroundColor: Colors.blue_04,
        borderBottomColor: '#333438',
        borderRadius: DEFAULT_BORDER_RADIUS,
        overflow: 'hidden'
    },
    selectContainer: {
        backgroundColor: '#f2f2f2',
        position: 'absolute'
    },
    dropShadow: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
        shadowOpacity: 0.8
    },
    arrow: {
        position: 'absolute',
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent'
    },
    content: {
        padding: Spacing.M,
        backgroundColor: Colors.blue_04,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

Popover.defaultDisplayArea = {};
Popover.PLACEMENT_OPTIONS = PLACEMENT_OPTIONS;
Popover.MODE = POPOVER_MODE;
Popover.defaultProps = {
    isVisible: true,
    skipAndroidStatusBar: false,
    mode: 'modal',
    placement: 'auto',
    verticalOffset: 0,
    popoverStyle: {},
    arrowStyle: {},
    backgroundStyle: {},
    onOpenStart: () => { },
    onOpenComplete: () => { },
    onRequestClose: () => { },
    onCloseStart: () => { },
    onCloseComplete: () => { },
};

Popover.propTypes = {
    // display
    isVisible: PropTypes.bool,
    skipAndroidStatusBar: PropTypes.bool,
    mode: PropTypes.oneOf(['modal', 'view']),

    // anchor
    fromRect: PropTypes.objectOf(PropTypes.number),
    fromView: PropTypes.object,
    fromDynamicRect: PropTypes.func,

    // config
    displayArea: PropTypes.objectOf(PropTypes.number),
    placement: PropTypes.oneOf(['top', 'bottom', 'right', 'left', 'right', 'auto']),
    animationConfig: PropTypes.object,
    verticalOffset: PropTypes.number,

    // style
    popoverStyle: PropTypes.object,
    arrowStyle: PropTypes.object,
    backgroundStyle: PropTypes.object,

    // lifecycle
    onOpenStart: PropTypes.func,
    onOpenComplete: PropTypes.func,
    onRequestClose: PropTypes.func,
    onCloseStart: PropTypes.func,
    onCloseComplete: PropTypes.func,

    content: PropTypes.string,
    contentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    textContentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default Popover;
