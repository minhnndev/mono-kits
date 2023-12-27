import React, { Component } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    View
} from 'react-native';

import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

const binarySearch = (arr, element) => {
    let right = arr.length - 1;
    let left = 0;
    let mid;
    while (left <= right) {
        mid = Math.floor((left + right) / 2);
        if (arr[mid] && arr[mid].y <= element) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return [left, right];
};

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y
      >= contentSize.height - paddingToBottom;
};

const headerListView = [];
const currentListView = [];

class ScrollableTabString extends Component {
    static HEADER_MAX_HEIGHT = Dimensions.get('window').width / 2;

    static HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

    static TAB_POSITION_TOP = 'top'

    static TAB_POSITION_BOTTOM = 'bottom'

    constructor(props) {
        super(props);
        this.state = {
            selectedScrollIndex: 0,
            isPressToScroll: false,
        };
        this.alreadyVisited = [];
        this.allowPressInHeaderMode = false;

        this.scrollY = new Animated.Value(0);
        this.headerViewRef = null;
        this.headerViewHeight = 0;
    }

    componentDidMount() {
        const {
            dataSections, dataTabs, isParent,
            tabPosition
        } = this.props;

        if (dataSections.length !== dataTabs.length && !isParent) {
            console.warn('The \'dataSections\' and \'dataTabs\''
            + ' length are not equal. This will cause some issues, especially when the section list is scrolling.'
            + ' Consider number of items of those lists to be equal, or add \'isParent\''
            + ' param if you are supporting parent tab - children sections');
        }

        if (tabPosition && (tabPosition !== ScrollableTabString.TAB_POSITION_BOTTOM) && (tabPosition !== ScrollableTabString.TAB_POSITION_TOP)) {
            console.warn('The tabPosition only accept \'top\' or \'bottom\' only !');
        }
        this.alreadyVisited = [...Array(dataTabs.length).fill({}, 0, dataTabs.length)];
    }

    componentDidUpdate(prevProps) {
        const { dataSections } = this.props;

        if (dataSections.length > prevProps.dataSections.length) {
            console.warn('Are you loading more items on the dataSections ? This component does not support on load more yet !');
        }
    }

    goToIndex = (item) => {
        const { onPressTab, headerView } = this.props;

        if ((headerView && this.allowPressInHeaderMode) || !headerView) {
            let marked;
            this.setState({ isPressToScroll: true });
            if (item.index === 0 && !headerView) {
                marked = 0;
            } else if (this.alreadyVisited[item?.index]?.y) {
                marked = this.alreadyVisited[item.index].y;
            } else {
                const listToCompare = cloneDeep(headerView ? headerListView : currentListView).filter((i) => i.item.index === item.index);
                listToCompare.sort((a, b) => a.y - b.y);

                const res = listToCompare[0] ? listToCompare[0] : {};

                marked = res?.y;
                this.alreadyVisited[item.index] = { y: res?.y };
            }
            this.tabScrollMainRef?.getNode().scrollTo({ animated: Platform.OS === 'ios', y: marked || 0 });
            this.setState({
                selectedScrollIndex: item?.index || 0
            });
        }
        onPressTab && onPressTab(item);
    }

    // map tab item
    dataTabNameChildren = ({ item, index }) => {
        const { renderTabName, selectedTabStyle, unselectedTabStyle } = this.props;
        const { selectedScrollIndex } = this.state;

        return React.Children.map(
            React.Children.toArray(renderTabName(item, index)),
            (children) => React.cloneElement(children, {
                style: { ...(index === selectedScrollIndex) ? selectedTabStyle : unselectedTabStyle },
                onPress: () => this.goToIndex(item),
            })
        );
    }

    // map section item
    dataSectionsChildren = (item, index) => {
        const { renderSection, dataSections, headerView } = this.props;

        return React.Children.map(
            React.Children.toArray(renderSection(item, index)),
            (children) => React.cloneElement(children, {
                onLayout: (e) => {
                    const { y, height } = e.nativeEvent.layout;
                    if (headerView) {
                        headerListView.push({
                            index: item.index,
                            item: { ...item },
                            height,
                            y: 0
                        });
                    } else {
                        currentListView.push({
                            item: { ...item },
                            y
                        });
                    }
                    if (headerView && headerListView.length >= dataSections.length) {
                        headerListView.sort((a, b) => a.index - b.index);
                        let sum = 0;
                        for (let i = 0; i < headerListView.length; i++) {
                            headerListView[i].y = sum + this.headerViewHeight;
                            sum += headerListView[i].height;
                        }
                    } else if (currentListView.length >= dataSections.length) {
                        currentListView.sort((a, b) => a.y - b.y);
                    }
                }
            })
        );
    }

    onScroll = (e) => {
        const {
            onScrollSection, dataTabs, headerTransitionWhenScroll, headerView
        } = this.props;
        const { isPressToScroll } = this.state;

        onScrollSection && onScrollSection(e);

        if (!isPressToScroll && headerTransitionWhenScroll) {
            try {
                const { y } = e.nativeEvent.contentOffset;
                if (y === 0 || y <= this.headerViewHeight) {
                    this.tabNamesRef?.getNode().scrollToOffset({
                        offset: 0,
                        animated: Platform.OS === 'ios',
                        viewPosition: 0.5,
                    });

                    this.setState({
                        selectedScrollIndex: 0,
                    });
                } else if (isCloseToBottom(e.nativeEvent)) {
                    const lastIndex = dataTabs.length - 1;

                    this.tabNamesRef?.getNode().scrollToIndex({
                        animated: Platform.OS === 'ios',
                        index: lastIndex,
                        viewPosition: 0.5,
                    });

                    this.setState({
                        selectedScrollIndex: lastIndex,
                    });
                } else {
                    const listToCompare = cloneDeep(headerView ? headerListView : currentListView);
                    const res = binarySearch(listToCompare, y);

                    const indexToScrollTo = res.includes(-1)
                        ? listToCompare[Math.max(...res)]?.item?.index
                        : Math.min(
                            listToCompare[res[0]]?.item?.index,
                            listToCompare[res[1]]?.item?.index
                        );

                    if (
                        indexToScrollTo
                        && indexToScrollTo !== -1
                    ) {
                        this.tabNamesRef?.getNode().scrollToIndex({
                            animated: Platform.OS === 'ios',
                            index: indexToScrollTo,
                            viewPosition: 0.5,
                        });

                        this.setState({
                            selectedScrollIndex: indexToScrollTo
                        });
                    } else {
                        this.tabNamesRef?.getNode().scrollToIndex({
                            animated: Platform.OS === 'ios',
                            index: 0,
                            viewPosition: 0.5,
                        });
                    }
                }
            } catch (err) {
                console.log('err: ');
            }
        }
    }

    returnIndices = () => {
        const { headerView, tabPosition } = this.props;
        if (headerView && tabPosition === ScrollableTabString.TAB_POSITION_TOP) return [1];
        return [0];
    }

    onScrollBeginDrag = (e) => {
        const { isPressToScroll } = this.state;
        const { headerView } = this.props;
        const { y } = e.nativeEvent.contentOffset;

        if (isPressToScroll) {
            this.setState({ isPressToScroll: false });
        }

        if (headerView) {
            if (y < this.headerViewHeight && this.allowPressInHeaderMode) {
                this.allowPressInHeaderMode = false;
            } else if (y >= this.headerViewHeight && !this.allowPressInHeaderMode) {
                this.allowPressInHeaderMode = true;
            }
        }
    }

    render() {
        const {
            dataTabs,
            dataSections,
            isParent,
            tabPosition,
            customSectionProps,
            customTabNamesProps,
            headerView
        } = this.props;
        return (
            <Animated.ScrollView
                scrollEventThrottle={1}
                removeClippedSubviews
                ref={(ref) => { this.tabScrollMainRef = ref; }}
                onScrollBeginDrag={this.onScrollBeginDrag}
                onScrollEndDrag={this.onScrollBeginDrag}
                bounces={false}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                onScroll={
                    Animated.event([{ nativeEvent: { contentOffset: { y: this.scrollY } } }], {
                        useNativeDriver: true,
                        listener: this.onScroll,
                    })
                }
                style={{ flex: 1, backgroundColor: 'white' }}
                stickyHeaderIndices={this.returnIndices()}
                {...customSectionProps}
            >
                { headerView ? (
                    <Animated.View
                        style={{
                            opacity: this.scrollY.interpolate({
                                inputRange: [0, ScrollableTabString.HEADER_MAX_HEIGHT - ScrollableTabString.HEADER_MIN_HEIGHT, ScrollableTabString.HEADER_MAX_HEIGHT],
                                outputRange: [1, 0.5, 0],
                                extrapolate: 'clamp'
                            })
                        }}
                        onLayout={(e) => {
                            const { height } = e.nativeEvent.layout;
                            this.headerViewHeight = height;
                        }}
                    >
                        { headerView() }
                    </Animated.View>
                ) : null}
                {
                    (tabPosition ? (
                        <Animated.FlatList
                            data={dataTabs.map((i, index) => ({ ...i, index }))}
                            nestedScrollEnabled
                            style={{
                                opacity: headerView ? this.scrollY.interpolate({
                                    inputRange: [0, ScrollableTabString.HEADER_MAX_HEIGHT - ScrollableTabString.HEADER_MIN_HEIGHT, ScrollableTabString.HEADER_MAX_HEIGHT],
                                    outputRange: [0, 0.5, 1],
                                    extrapolate: 'clamp'
                                }) : 1
                            }}
                            keyboardShouldPersistTaps="always"
                            ref={(ref) => { this.tabNamesRef = ref; }}
                            keyExtractor={(item) => item?.index}
                            contentContainerStyle={{
                                backgroundColor: 'white',
                            }}
                            showsHorizontalScrollIndicator={false}
                            bounces={false}
                            horizontal
                            renderItem={this.dataTabNameChildren}
                            {...customTabNamesProps}
                        />
                    ) : null)
                }
                <View>
                    { (isParent ? dataSections : dataSections.map((i, index) => ({ ...i, index }))).map(this.dataSectionsChildren) }
                </View>
                {
                    (tabPosition === ScrollableTabString.TAB_POSITION_BOTTOM ? (
                        <Animated.FlatList
                            style={{ position: 'absolute', bottom: 0 }}
                            keyboardShouldPersistTaps="always"
                            nestedScrollEnabled
                            data={dataTabs.map((i, index) => ({ ...i, index }))}
                            contentContainerStyle={{
                                backgroundColor: 'white',
                            }}
                            ref={(ref) => { this.tabNamesRef = ref; }}
                            keyExtractor={(item) => item.index}
                            showsHorizontalScrollIndicator={false}
                            bounces={false}
                            horizontal
                            renderItem={this.dataTabNameChildren}
                            {...customTabNamesProps}
                        />

                    ) : null)
                }
            </Animated.ScrollView>
        );
    }
}

ScrollableTabString.propTypes = {
    dataTabs: PropTypes.array,
    dataSections: PropTypes.array,
    isParent: PropTypes.bool,
    headerTransitionWhenScroll: PropTypes.bool,
    renderSection: PropTypes.func,
    renderTabName: PropTypes.func,
    onPressTab: PropTypes.func,
    onScrollSection: PropTypes.func,
    headerView: PropTypes.func,
    customTabNamesProps: PropTypes.object,
    customSectionProps: PropTypes.object,
    tabPosition: PropTypes.oneOf([ScrollableTabString.TAB_POSITION_TOP, ScrollableTabString.TAB_POSITION_BOTTOM]),
    selectedTabStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    unselectedTabStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

ScrollableTabString.defaultProps = {
    dataSections: [],
    dataTabs: [],
    isParent: false,
    headerTransitionWhenScroll: true,
    tabPosition: 'top',
    selectedTabStyle: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    unselectedTabStyle: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerView: null
};

export default ScrollableTabString;
