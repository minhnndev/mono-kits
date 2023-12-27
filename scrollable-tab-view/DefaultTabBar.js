/* eslint-disable import/no-unresolved */
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
    Colors, Spacing, Text, Image, ValueUtil
} from '@momo-kits/core';

const React = require('react');
const ReactNative = require('react-native');

const {
    StyleSheet,
    View,
    Animated,
    ViewPropTypes,
    ScrollView,
    Dimensions
} = ReactNative;
const Button = require('./Button');

const iconStyles = StyleSheet.create({
    small: {
        width: 24,
        height: 24
    },
    default: {
        width: 28,
        height: 28
    },
});

const { width: SCREEN_WIDTH } = Dimensions.get('window');
class DefaultTabBar extends React.Component {
    tabBarWidth = {};

    lastActivePage = 0;

    sumOfWidth = (page) => {
        let sum = 0;
        Object.keys(this.tabBarWidth).forEach((k) => {
            if (parseInt(k) < page) {
                sum += this.tabBarWidth[k];
            }
        });
        return sum;
    }

    /**
     * use of scroll tab bar
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.lastActivePage !== nextProps.activeTab) {
            const activetabWidth = get(this.tabBarWidth, `[${nextProps.activeTab}]`, 0) / 2;
            const sumWidth = this.sumOfWidth(nextProps.activeTab) - SCREEN_WIDTH / 2 + activetabWidth;
            if (this.barScroll) {
                this.barScroll.scrollTo({ x: sumWidth, animated: false });
            }
        }
    }

    renderTab = (tab, page, isTabActive, onPressHandler) => {
        // HungHC: Keep last Active TAB
        const {
            activeTab, textStyle, activeTextStyle = {}, inactiveTextStyle = {}, tabStyle, activeTextColor, inactiveTextColor,
            tabScrollable, tabUnderlineStyle, indicatorBarColor, iconSize, iconStyle
        } = this.props;
        if (activeTab >= 0) {
            this.lastActivePage = activeTab;
        }

        const textColor = this.lastActivePage === page ? activeTextColor : inactiveTextColor;
        const customTextStyle = this.lastActivePage === page ? { ...activeTextStyle, bottom: -2 } : inactiveTextStyle;
        const tabUnderlineStyleScroll = tabScrollable && this.lastActivePage === page ? { ...styles.tabScrollable, borderBottomColor: indicatorBarColor } : {};
        const weight = this.lastActivePage === page ? 'bold' : 'normal';
        const iconSource = ValueUtil.getImageSource(tab.icon);
        const tabRowStyle = tab.icon ? { flexDirection: 'row' } : {};
        return (
            <Button
                style={{ flex: 1 }}
                key={tab.name}
                accessible
                accessibilityLabel={tab.name}
                accessibilityTraits="button"
                onPress={() => onPressHandler(page)}
            >
                <View
                    style={[styles.tab, tabStyle, tabUnderlineStyleScroll, tabUnderlineStyle, tabRowStyle]}
                    onLayout={(e) => {
                        this.tabBarWidth[page] = e.nativeEvent.layout.width;
                    }}
                >
                    {tab.icon ? <Image source={iconSource} style={[styles.icon, iconStyle, iconStyles[iconSize]]} /> : <View />}
                    <Text.Title weight={weight} style={[{ color: textColor, paddingVertical: 5, }, textStyle, customTextStyle]}>
                        {tab.name}
                    </Text.Title>
                </View>
            </Button>
        );
    };

    render() {
        const {
            containerWidth, tabs, scrollValue, activeTab, renderTab, backgroundColor, style, goToPage, styleTabbar, underlineStyle, tabScrollable, indicatorBarColor
        } = this.props;
        const numberOfTabs = tabs.length;

        const tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs,
            height: 4,
            backgroundColor: indicatorBarColor,
            bottom: -1,
        };

        const translateX = scrollValue.interpolate({
            inputRange: [0, 1], outputRange: [0, containerWidth / numberOfTabs],
        });
        return (
            <View style={[styles.tabs, { backgroundColor }, style, styleTabbar]}>
                {tabScrollable ? (
                    <ScrollView
                        ref={(ref) => this.barScroll = ref}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.scrollbar}
                    >
                        {tabs.map((tab, page) => {
                            const isTabActive = activeTab === page;
                            const _renderTab = renderTab || this.renderTab;
                            return _renderTab(tab, page, isTabActive, goToPage);
                        })}
                    </ScrollView>
                ) : tabs.map((tab, page) => {
                    const isTabActive = activeTab === page;
                    const _renderTab = renderTab || this.renderTab;
                    return _renderTab(tab, page, isTabActive, goToPage);
                })}
                {!tabScrollable ? (
                    <Animated.View style={[tabUnderlineStyle, {
                        transform: [
                            { translateX },
                        ],
                    }, underlineStyle]}
                    />
                ) : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.M
    },
    tabs: {
        minHeight: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderWidth: 1,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: 'transparent',
    },
    tabScrollable: {
        marginHorizontal: 10,
        borderBottomWidth: 2
    },
    scrollbar: { borderBottomWidth: 1, borderBottomColor: '#e4e4e4', bottom: -1 },
    icon: { marginRight: Spacing.S }
});

module.exports = DefaultTabBar;

DefaultTabBar.propTypes = {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: ViewPropTypes.style,
    renderTab: PropTypes.func,
    underlineStyle: ViewPropTypes.style,
    tabScrollable: PropTypes.bool,
    iconSize: PropTypes.string
};

DefaultTabBar.defaultProps = {
    activeTextColor: Colors.black_17,
    inactiveTextColor: Colors.black_17,
    backgroundColor: null,
    iconSize: 'small'
};
