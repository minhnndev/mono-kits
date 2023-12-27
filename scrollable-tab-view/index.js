/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-undef */
/* eslint-disable react/state-in-constructor */
/* eslint-disable react/static-property-placement */
import { ViewPager as ViewPagerAndroid } from '@momo-kits/core';

import PropTypes from 'prop-types';
import { Colors } from '@momo-kits/core';

const React = require('react');
const ReactNative = require('react-native');

const { Dimensions, View, Animated, Platform, StyleSheet, ViewPropTypes } =
    ReactNative;
const SceneComponent = require('./SceneComponent');
const DefaultTabBar = require('./DefaultTabBar');
const ScrollableTabBar = require('./ScrollableTabBar');

const AnimatedViewPagerAndroid =
    Platform.OS === 'android'
        ? Animated.createAnimatedComponent(ViewPagerAndroid)
        : undefined;
class ScrollableTabView extends React.Component {
    static displayName = 'ScrollableTabView';

    static DefaultTabBar = DefaultTabBar;

    static ScrollableTabBar = ScrollableTabBar;

    constructor(props) {
        super(props);
        const containerWidth = Dimensions.get('window').width;
        let scrollValue;
        let scrollXIOS;
        let positionAndroid;
        let offsetAndroid;

        if (Platform.OS === 'ios') {
            scrollXIOS = new Animated.Value(props.initialPage * containerWidth);
            const containerWidthAnimatedValue = new Animated.Value(
                containerWidth,
            );
            // Need to call __makeNative manually to avoid a native animated bug. See
            // https://github.com/facebook/react-native/pull/14435
            containerWidthAnimatedValue.__makeNative();
            scrollValue = Animated.divide(
                scrollXIOS,
                containerWidthAnimatedValue,
            );

            const callListeners = this._polyfillAnimatedValue(scrollValue);
            scrollXIOS.addListener(({ value }) =>
                callListeners(value / containerWidth),
            );
        } else {
            positionAndroid = new Animated.Value(props.initialPage);
            offsetAndroid = new Animated.Value(0);
            scrollValue = Animated.add(positionAndroid, offsetAndroid);

            const callListeners = this._polyfillAnimatedValue(scrollValue);
            let positionAndroidValue = props.initialPage;
            let offsetAndroidValue = 0;
            positionAndroid.addListener(({ value }) => {
                positionAndroidValue = value;
                callListeners(positionAndroidValue + offsetAndroidValue);
            });
            offsetAndroid.addListener(({ value }) => {
                offsetAndroidValue = value;
                callListeners(positionAndroidValue + offsetAndroidValue);
            });
        }

        this.state = {
            currentPage: props.initialPage || 0,
            scrollValue,
            scrollXIOS,
            positionAndroid,
            offsetAndroid,
            containerWidth,
            sceneKeys: this.newSceneKeys({ currentPage: props.initialPage }),
        };
    }

    componentDidUpdate(prevProps) {
        const { children, page } = this.props;
        const { currentPage } = this.state;

        if (prevProps.children !== children) {
            this.updateSceneKeys({ page: currentPage, children });
        }

        if (page >= 0 && page !== currentPage) {
            this.goToPage(page);
        }
    }

    componentWillUnmount() {
        // this.state.scrollXIOS.removeAllListeners();
        if (Platform.OS === 'ios') {
            this.state.scrollXIOS.removeAllListeners();
        } else {
            this.state.positionAndroid.removeAllListeners();
            this.state.offsetAndroid.removeAllListeners();
        }
    }

    goToPage = (pageNumber) => {
        const { offChangeTab, scrollWithoutAnimation } = this.props;
        const { containerWidth, currentPage } = this.state;
        if (offChangeTab) {
            return;
        }
        if (pageNumber != null && pageNumber !== undefined) {
            if (Platform.OS === 'ios') {
                const offset = pageNumber * containerWidth;
                if (this.scrollView && this.scrollView?.scrollTo) {
                    this.scrollView.scrollTo({
                        x: offset,
                        y: 0,
                        animated: !scrollWithoutAnimation,
                    });
                } else {
                    this.scrollView.getNode().scrollTo({
                        x: offset,
                        y: 0,
                        animated: !scrollWithoutAnimation,
                    });
                }
            } else if (this.scrollView) {
                this.tabWillChangeWithoutGesture = true;
                if (scrollWithoutAnimation) {
                    if (this.scrollView?.setPageWithoutAnimation) {
                        this.scrollView.setPageWithoutAnimation(pageNumber);
                    } else {
                        this.scrollView
                            .getNode()
                            .setPageWithoutAnimation(pageNumber);
                    }
                } else if (this.scrollView?.setPage) {
                    this.scrollView.setPage(pageNumber);
                } else {
                    this.scrollView.getNode().setPage(pageNumber);
                }
            }
            this.updateSceneKeys({
                page: pageNumber,
                callback: () => this._onChangeTab(currentPage, pageNumber),
            });
        }
    };

    renderTabBar = (props) => {
        const { renderTabBar, tabScrollable } = this.props;
        if (renderTabBar === false) {
            return null;
        }
        if (renderTabBar) {
            return React.cloneElement(renderTabBar(props), props);
        }
        return <DefaultTabBar tabScrollable={tabScrollable} {...props} />;
    };

    updateSceneKeys = ({
        page,
        children = this.props.children,
        callback = () => {},
    }) => {
        const { sceneKeys } = this.state;
        const newKeys = this.newSceneKeys({
            previousKeys: sceneKeys,
            currentPage: page,
            children,
        });
        this.setState({ currentPage: page, sceneKeys: newKeys }, callback);
    };

    newSceneKeys = ({
        previousKeys = [],
        currentPage = 0,
        children = this.props.children,
    }) => {
        const newKeys = [];
        this._children(children).forEach((child, idx) => {
            const key = this._makeSceneKey(child, idx);
            if (
                this._keyExists(previousKeys, key) ||
                this._shouldRenderSceneKey(idx, currentPage)
            ) {
                newKeys.push(key);
            }
        });
        return newKeys;
    };

    _polyfillAnimatedValue(animatedValue) {
        const listeners = new Set();
        const addListener = (listener) => {
            listeners.add(listener);
        };

        const removeListener = (listener) => {
            listeners.delete(listener);
        };

        const removeAllListeners = () => {
            listeners.clear();
        };

        animatedValue.addListener = addListener;
        animatedValue.removeListener = removeListener;
        animatedValue.removeAllListeners = removeAllListeners;

        return (value) => listeners.forEach((listener) => listener({ value }));
    }

    _shouldRenderSceneKey = (idx, currentPageKey) => {
        const { prerenderingSiblingsNumber } = this.props;
        const numOfSibling = prerenderingSiblingsNumber;
        return (
            idx < currentPageKey + numOfSibling + 1 &&
            idx > currentPageKey - numOfSibling - 1
        );
    };

    _keyExists = (sceneKeys, key) =>
        sceneKeys.find((sceneKey) => key === sceneKey);

    _makeSceneKey = (child, idx) => `${child.props.tabLabel}_${idx}`;

    _onScroll = (e) => {
        const { onScroll } = this.props;
        if (Platform.OS === 'ios') {
            const offsetX = e.nativeEvent.contentOffset.x;
            if (offsetX === 0 && !this.scrollOnMountCalled) {
                this.scrollOnMountCalled = true;
            } else {
                onScroll &&
                    typeof onScroll === 'function' &&
                    onScroll(offsetX / this.state.containerWidth);
            }
        } else {
            const { position, offset } = e.nativeEvent;
            onScroll &&
                typeof onScroll === 'function' &&
                onScroll(position + offset);
        }
    };

    renderScrollableContent = () => {
        const { initialPage, locked, contentProps } = this.props;
        const { containerWidth, positionAndroid, offsetAndroid, scrollXIOS } =
            this.state;
        const scenes = this._composeScenes();
        if (Platform.OS === 'ios') {
            return (
                <Animated.ScrollView
                    horizontal
                    pagingEnabled
                    keyboardShouldPersistTaps="always"
                    automaticallyAdjustContentInsets={false}
                    contentOffset={{ x: initialPage * containerWidth }}
                    ref={(scrollView) => {
                        this.scrollView = scrollView;
                    }}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollXIOS } } }],
                        { useNativeDriver: true, listener: this._onScroll },
                    )}
                    onMomentumScrollBegin={this._onMomentumScrollBeginAndEnd}
                    onMomentumScrollEnd={this._onMomentumScrollBeginAndEnd}
                    scrollEventThrottle={16}
                    scrollsToTop={false}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={!locked}
                    directionalLockEnabled
                    alwaysBounceVertical={false}
                    keyboardDismissMode="on-drag"
                    {...contentProps}>
                    {scenes}
                </Animated.ScrollView>
            );
        }
        return (
            <AnimatedViewPagerAndroid
                key={this._children().length}
                style={styles.scrollableContentAndroid}
                onPageSelected={this._updateSelectedPage}
                keyboardDismissMode="on-drag"
                scrollEnabled={!locked}
                onPageScroll={Animated.event(
                    [
                        {
                            nativeEvent: {
                                position: positionAndroid,
                                offset: offsetAndroid,
                            },
                        },
                    ],
                    {
                        useNativeDriver: true,
                        listener: this._onScroll,
                    },
                )}
                ref={(scrollView) => {
                    this.scrollView = scrollView;
                }}
                initialPage={initialPage}
                {...contentProps}>
                {scenes}
            </AnimatedViewPagerAndroid>
        );
    };

    _composeScenes = () =>
        this._children().map((child, idx) => {
            const key = this._makeSceneKey(child, idx);
            const { currentPage, containerWidth, sceneKeys } = this.state;
            return (
                <SceneComponent
                    key={child.key}
                    shouldUpdated={this._shouldRenderSceneKey(idx, currentPage)}
                    style={{ width: containerWidth }}>
                    {this._keyExists(sceneKeys, key) ? (
                        child
                    ) : (
                        <View tabLabel={child.props.tabLabel} />
                    )}
                </SceneComponent>
            );
        });

    _onMomentumScrollBeginAndEnd = (e) => {
        const offsetX = e.nativeEvent.contentOffset.x;
        const { currentPage, containerWidth } = this.state;
        const page = Math.round(offsetX / containerWidth);
        if (currentPage !== page) {
            this._updateSelectedPage(page);
        }
    };

    _updateSelectedPage = (nextPage) => {
        let localNextPage = nextPage;
        if (typeof localNextPage === 'object') {
            localNextPage = nextPage.nativeEvent.position;
        }
        const { currentPage } = this.state;
        !this.tabWillChangeWithoutGesture &&
            this.updateSceneKeys({
                page: localNextPage,
                callback: () => this._onChangeTab(currentPage, localNextPage),
            });
        this.tabWillChangeWithoutGesture = false;
        // if (currentPage !== localNextPage && Platform.OS === 'android') {
        //     this.updateSceneKeys({
        //         page: localNextPage,
        //         callback: () => this._onChangeTab(currentPage, localNextPage),
        //     });
        // } else {
        //     this.updateSceneKeys({
        //         page: localNextPage,
        //         callback: () => this._onChangeTab(currentPage, localNextPage),
        //     });
        // }
    };

    _onChangeTab = (prevPage, currentPage) => {
        const { onChangeTab } = this.props;
        onChangeTab({
            i: currentPage,
            ref: this._children()[currentPage],
            from: prevPage,
        });
    };

    _handleLayout = (e) => {
        const { width } = e.nativeEvent.layout;
        const { containerWidth, currentPage } = this.state;

        if (Math.round(width) !== Math.round(containerWidth)) {
            this.setState({ containerWidth: width });
            requestAnimationFrame(() => {
                this.goToPage(currentPage);
            });
        }
    };

    _children = (children = this.props.children) =>
        React.Children.map(children, (child) => child);

    render() {
        const overlayTabs =
            this.props.tabBarPosition === 'overlayTop' ||
            this.props.tabBarPosition === 'overlayBottom';
        const tabBarProps = {
            goToPage: this.goToPage,
            tabs: this._children().map((child) => ({
                name: child.props.tabLabel,
                icon: child.props.icon,
            })),
            activeTab: this.state.currentPage,
            scrollValue: this.state.scrollValue,
            containerWidth: this.state.containerWidth,
        };
        if (this.props.tabBarBackgroundColor) {
            tabBarProps.backgroundColor = this.props.tabBarBackgroundColor;
        }
        if (this.props.tabBarUnderlineColor) {
            tabBarProps.indicatorBarColor = this.props.tabBarUnderlineColor;
        }
        if (this.props.tabBarActiveTextColor) {
            tabBarProps.activeTextColor = this.props.tabBarActiveTextColor;
        }
        if (this.props.tabBarInactiveTextColor) {
            tabBarProps.inactiveTextColor = this.props.tabBarInactiveTextColor;
        }
        if (this.props.tabBarTextStyle) {
            tabBarProps.textStyle = this.props.tabBarTextStyle;
        }
        if (this.props.tabBarUnderlineStyle) {
            tabBarProps.underlineStyle = this.props.tabBarUnderlineStyle;
        }
        if (this.props.activeTextStyle) {
            tabBarProps.activeTextStyle = this.props.activeTextStyle;
        }
        if (this.props.inactiveTextStyle) {
            tabBarProps.inactiveTextStyle = this.props.inactiveTextStyle;
        }
        if (this.props.styleTabbar) {
            tabBarProps.styleTabbar = this.props.styleTabbar;
        }
        if (this.props.renderTab) {
            tabBarProps.renderTab = this.props.renderTab;
        }
        if (this.props.tabStyle) {
            tabBarProps.tabStyle = this.props.tabStyle;
        }
        if (this.props.iconSize) {
            tabBarProps.iconSize = this.props.iconSize;
        }
        if (this.props.iconStyle) {
            tabBarProps.iconStyle = this.props.iconStyle;
        }

        if (overlayTabs) {
            tabBarProps.style = {
                position: 'absolute',
                left: 0,
                right: 0,
                [this.props.tabBarPosition === 'overlayTop'
                    ? 'top'
                    : 'bottom']: 0,
            };
        }

        return (
            <View
                style={[styles.container, this.props.style]}
                onLayout={this._handleLayout}>
                {this.props.tabBarPosition === 'top' &&
                    this.props.isShowTab &&
                    this.renderTabBar(tabBarProps)}
                {this.renderScrollableContent()}
                {(this.props.tabBarPosition === 'bottom' || overlayTabs) &&
                    this.props.isShowTab &&
                    this.renderTabBar(tabBarProps)}
            </View>
        );
    }
}

export default ScrollableTabView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollableContentAndroid: {
        flex: 1,
    },
});

ScrollableTabView.propTypes = {
    tabBarPosition: PropTypes.oneOf([
        'top',
        'bottom',
        'overlayTop',
        'overlayBottom',
    ]),
    initialPage: PropTypes.number,
    page: PropTypes.number,
    onChangeTab: PropTypes.func,
    onScroll: PropTypes.func,
    renderTabBar: PropTypes.any,
    style: ViewPropTypes.style,
    contentProps: PropTypes.object,
    scrollWithoutAnimation: PropTypes.bool,
    locked: PropTypes.bool,
    prerenderingSiblingsNumber: PropTypes.number,
    tabScrollable: PropTypes.bool,
    tabBarUnderlineColor: PropTypes.string,
    tabBarBackgroundColor: PropTypes.string,
    tabBarActiveTextColor: PropTypes.string,
    tabBarInactiveTextColor: PropTypes.string,
    tabBarTextStyle: PropTypes.object,
    activeTextStyle: PropTypes.any,
    isShowTab: PropTypes.bool,
};

ScrollableTabView.defaultProps = {
    tabBarPosition: 'top',
    isShowTab: true,
    initialPage: 0,
    page: -1,
    onChangeTab: () => {},
    onScroll: () => {},
    contentProps: {},
    scrollWithoutAnimation: false,
    locked: false,
    prerenderingSiblingsNumber: 0,
    tabBarUnderlineColor: Colors.pink_04,
    tabBarBackgroundColor: 'white',
    tabBarActiveTextColor: Colors.black_17,
    tabBarInactiveTextColor: Colors.black_17,
    tabBarTextStyle: { lineHeight: 18 },
};
