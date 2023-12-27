import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, StyleSheet, Dimensions, TouchableOpacity, Animated
} from 'react-native';
import { get } from 'lodash';
import {
    Colors, Image, Text, ScreenUtils, ViewPager
} from '@momo-kits/core';

const { ifIphoneX } = ScreenUtils;

const DOT_CONTAINER_WIDTH = 18;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: ifIphoneX(24, 0)
    },
    bottomView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        paddingHorizontal: 25,
    },
    viewPager: {
        flex: 1
    },
    flex: {
        flex: 1
    },
    circleDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: Colors.primary
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dotContainer: {
        width: DOT_CONTAINER_WIDTH, alignItems: 'center', justifyContent: 'center'
    },
    indicatorBar: {
        width: DOT_CONTAINER_WIDTH,
        height: 6,
        backgroundColor: Colors.primary,
        position: 'absolute',
        borderRadius: 4
    },
    nextButton: {
        color: Colors.primary,
        // fontSize: 16
    },
    page: {
        padding: 10
    },
    title: {
        color: '#222222',
        // fontSize: 17,
        fontWeight: 'bold'
    },
    body: {
        // fontSize: 15,
        color: '#222222',
        marginTop: 15
    },
    indicatorBarView: {
        left: 0, right: 0, position: 'absolute', alignItems: 'center'
    },
    backButton: {
        color: Colors.text_color
    },
    imageContainer: {

    },
    image: {
        width: SCREEN_WIDTH - 20,
        height: SCREEN_WIDTH - 20
    }
});

const hitSlop = {
    top: 10, left: 5, bottom: 10, right: 5
};

export default class HorizontalPageGuide extends Component {
    constructor(props) {
        super(props);
        this.opacityText = new Animated.Value(1);
        this.state = {
            nativeEvent: { position: 0, offset: 0 }
        };
        this.previousPage = 0;
    }

    renderDots = () => {
        const { data } = this.props;
        const dots = data.map((item, index) => (
            <View key={index.toString()} style={styles.dotContainer}>
                <Animated.View style={styles.circleDot} />
            </View>
        ));
        return dots;
    }

    onPageScroll = ({ nativeEvent }) => {
        this.setState({ nativeEvent });
    }

    renderTop = (item) => {
        const { titleStyle, bodyStyle } = this.props;
        return (
            <View>
                {item.title ? <Text.H4 style={[styles.title, titleStyle]}>{item.title}</Text.H4> : <View />}
                {item.body ? <Text.Title style={[styles.body, bodyStyle]}>{item.body}</Text.Title> : <View />}
                {item.customComponent}
            </View>
        );
    }

    renderPage = (item, index) => {
        const { imageContainerStyle, imageStyle } = this.props;
        const marginTopBottom = get(imageContainerStyle, 'marginVertical', 10);
        const marginTop = item.position === 'bottom' ? { marginBottom: marginTopBottom } : { marginTop: marginTopBottom };
        const { renderContent } = item;
        if (renderContent) {
            return <View key={index}>{renderContent}</View>;
        }
        return (
            <View key={index} style={styles.page}>
                {(item.position === 'bottom') ? <View /> : this.renderTop(item)}
                {item.source ? (
                    <View style={[styles.imageContainer, marginTop, imageContainerStyle]}>
                        <Image style={[styles.image, imageStyle]} source={item.source} />
                    </View>
                ) : <View />}
                {(item.position === 'bottom') ? this.renderTop(item) : <View />}

            </View>
        );
    }

    backButtonOpacity = () => {
        const { nativeEvent: { position, offset } } = this.state;
        if (position === 0) return offset;
        if (position === 1) {
            return offset + 1;
        }
        return 1;
    }

    next = () => {
        const { nativeEvent: { position } } = this.state;
        const { data } = this.props;

        if (position === data.length - 1) {
            const { onTripEndButtonPress } = this.props;
            if (onTripEndButtonPress && typeof onTripEndButtonPress === 'function') onTripEndButtonPress();
        } else if (this.pager) {
            this.pager.setPage(position + 1);
        }
    }

    back = () => {
        if (this.pager) {
            const { nativeEvent } = this.state;
            this.pager.setPage(nativeEvent.position - 1);
        }
    }

    render() {
        const {
            data, backButton, nextButton, tripEndButton, onIndexChanged = () => { }, replacePaginationOnTripEnd
        } = this.props;
        const width = data.length * DOT_CONTAINER_WIDTH;
        const { nativeEvent } = this.state;
        const { position, offset } = nativeEvent;
        const translateX = position * DOT_CONTAINER_WIDTH + offset * DOT_CONTAINER_WIDTH;
        const tripEndOrNextButton = (position === data.length - 1) ? tripEndButton : nextButton;
        const onPageSelected = (e) => onIndexChanged(e.nativeEvent.position);
        return (
            <View style={styles.container}>
                <View style={styles.flex}>
                    <ViewPager
                        ref={(ref) => this.pager = ref}
                        onPageScroll={this.onPageScroll}
                        style={styles.viewPager}
                        onPageSelected={onPageSelected}
                        initialPage={0}
                    >
                        {data.map(this.renderPage)}
                    </ViewPager>
                </View>
                {
                    replacePaginationOnTripEnd && position === data.length - 1
                        ? <View style={styles.bottomView}>{replacePaginationOnTripEnd}</View> : (
                            <View style={styles.bottomView}>
                                <TouchableOpacity hitSlop={hitSlop} activeOpacity={0.5} onPress={this.back}>
                                    <Animated.Text style={[{ opacity: this.backButtonOpacity() }, styles.backButton]}>{backButton}</Animated.Text>
                                </TouchableOpacity>

                                <View style={styles.indicatorBarView}>
                                    <View style={[styles.row, { width }]}>
                                        {this.renderDots()}
                                        <Animated.View style={[{ left: translateX }, styles.indicatorBar]} />
                                    </View>
                                </View>
                                <TouchableOpacity hitSlop={hitSlop} activeOpacity={0.5} onPress={this.next}>
                                    <Text.H4 style={[styles.nextButton]}>{tripEndOrNextButton}</Text.H4>
                                </TouchableOpacity>
                            </View>
                        )
                }

            </View>
        );
    }
}

HorizontalPageGuide.propTypes = {
    backButton: PropTypes.string,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            body: PropTypes.string,
            source: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({ uri: PropTypes.string })]),
            position: PropTypes.oneOf(['top', 'bottom']),
            customComponent: PropTypes.element,
            renderContent: PropTypes.element,
        })
    ),
    bodyStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    imageContainerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    imageStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    nextButton: PropTypes.string,
    tripEndButton: PropTypes.string,
    titleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onTripEndButtonPress: PropTypes.func,
    onIndexChanged: PropTypes.func,
    replacePaginationOnTripEnd: PropTypes.element
};

HorizontalPageGuide.defaultProps = {
    data: []
};
