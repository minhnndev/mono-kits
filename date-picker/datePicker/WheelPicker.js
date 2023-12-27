import React, { Component } from 'react';
import {
    Dimensions, View
} from 'react-native';
import {
    LinearGradient, Text, Colors, ScaleSize
} from '@momo-kits/core';
import ScrollCustom from './custom/ScrollCustom';
import DatePickerHelper from './helper/DatePickerHelper';

const widthScreen = Dimensions.get('window').width;
// var heightScreen = Dimensions.get('window').height;

export default class WheelPicker extends Component {
    constructor(props) {
        super(props);
        const {
            heightItem, value: valueItem, numberItem, arrayValue
        } = this.props;
        const value = valueItem === -1 ? 0 : valueItem;
        this.heightItem = heightItem;
        this.currentPosition = value * this.heightItem;
        this.prePosition = this.currentPosition;
        this.numberItem = this.convertNumberItem(numberItem);
        this.isDragging = false;
        this.state = {
            // height: 100,
            width: widthScreen / 3,
            value,
            items: arrayValue
        };
    }

    componentDidMount() {
        const { value } = this.props;
        this.scrollToPosition(value);
    }

    componentWillUnmounted() {
        clearTimeout(this.timer);
        clearTimeout(this.timerUpdate);
    }

    scrollToPosition(position) {
        this.currentPosition = position * this.heightItem;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (this.ScrollWheelPicker && this.ScrollWheelPicker.scrollTo) {
                this.ScrollWheelPicker.scrollTo({ y: this.currentPosition });
            }
        }, 500);
    }

    update(param) {
        this.setState({
            items: param.arrayValue,
            value: param.value
        }, () => {
            clearTimeout(this.timerUpdate);
            this.timerUpdate = setTimeout(() => {
                this.scrollToPosition(param.value);
            }, 100);
        });
    }

    setScrollEnabled(enable) {
        if (this.ScrollWheelPicker && this.ScrollWheelPicker.setScrollEnabled && !this.isDragging) {
            this.ScrollWheelPicker.setScrollEnabled(enable);
        }
    }

    onValueChange() {
        if (this.currentPosition != null) {
            const { value } = this.state;
            const { onValueChange, onEndDrag, refName } = this.props;
            const position = this.parseInteger(this.currentPosition / this.heightItem);
            if (position !== value) {
                this.setState({
                    value: position
                }, () => {
                    this.scrollToPosition(position);
                });
            }
            if (onValueChange) {
                onValueChange(position);
            }
            if (onEndDrag) {
                onEndDrag(refName);
            }
        }
    }

    parseInteger(number) {
        const mode = (number * 10) % 10;
        if (mode > 5) {
            return parseInt(number, 10) + 1;
        }
        return parseInt(number, 10);
    }

    checkEvenNumber(number) {
        const mode = number % 2;
        if (mode > 0) {
            return false;
        }
        return true;
    }

    convertNumberItem(number) {
        let numberItem = number;
        if (this.checkEvenNumber(numberItem)) {
            numberItem += 1;
        }

        return numberItem;
    }

    renderHiddenItem(numberItem, heightItem, offset = 0) {
        const numberItemTop = parseInt(numberItem / 2, 10) - offset;
        const view = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < numberItemTop; i++) {
            view.push(<View
                key={`itemTop${i}`}
                style={{
                    flex: 1,
                    height: heightItem,
                }}
            />);
        }

        return view;
    }

    onStartDrag(rawPosition) {
        this.currentPosition = rawPosition;
        const { onBeginDrag, refName } = this.props;
        this.isDragging = true;
        if (onBeginDrag) {
            onBeginDrag(refName);
        }
        this.createCheckDragging();
    }

    onEndDrag() {
        if (this.isDragging) {
            this.isDragging = false;
            this.onValueChange();
        }
        if (this.checkEndDrag) {
            clearInterval(this.checkEndDrag);
        }
    }

    createCheckDragging() {
        this.checkEndDrag = setInterval(() => {
            this.checkPosition();
        }, 50);
    }

    checkPosition() {
        if (this.currentPosition === this.prePosition) {
            this.onEndDrag();
        } else {
            this.prePosition = this.currentPosition;
        }
    }

    render() {
        const numberHiddenItem = parseInt(this.numberItem / 2, 10);
        const positionCenter = parseInt(this.heightItem * numberHiddenItem, 10);
        const heightContain = parseInt(this.heightItem * this.numberItem, 10);
        const { items, value, width } = this.state;
        const { preFix, bottomOffset } = this.props;
        return (
            <View style={{ flex: 1, height: heightContain + 40 }}>
                <Text.SubTitle weight='bold' style={{
                    color: Colors.black_17, marginLeft: 6, marginBottom: 3
                }}
                >
                    {DatePickerHelper.capitalizeFirstLetter(preFix || '')}
                </Text.SubTitle>
                <View
                    style={{
                        flex: 1,
                        height: heightContain,
                        //backgroundColor: 'blue',
                        marginHorizontal: 6,
                        paddingBottom: 20,
                        borderWidth: 1,
                        borderColor: Colors.black_04,
                        borderRadius: 8,
                        overflow: 'hidden'
                    }}
                    onLayout={(event) => {
                        if (event && event.nativeEvent && event.nativeEvent.layout
                            && event.nativeEvent.layout.height && event.nativeEvent.layout.width) {
                            this.setState({
                                // height: event.nativeEvent.layout.height,
                                width: event.nativeEvent.layout.width
                            });
                        }
                    }}
                >
                    <View style={{
                        position: 'absolute',
                        top: positionCenter,
                        left: 0,
                        height: this.heightItem, // + 12,
                        width,
                        backgroundColor: '#f2f8ff',
                    }}
                    />

                    <ScrollCustom
                        ref={(refName) => {
                            this.ScrollWheelPicker = refName;
                        }}
                        onScrollEndDrag={(event) => {
                            if (event && event.nativeEvent && event.nativeEvent.contentOffset
                                && event.nativeEvent.contentOffset.y != null && !this.isDragging) {
                                this.onStartDrag(event.nativeEvent.contentOffset.y);
                            }
                        }}
                        onScroll={(event) => {
                            if (event && event.nativeEvent && event.nativeEvent.contentOffset
                                && event.nativeEvent.contentOffset.y != null) {
                                this.currentPosition = event.nativeEvent.contentOffset.y;
                            }
                        }}
                    >

                        {
                            this.renderHiddenItem(this.numberItem, this.heightItem)
                        }
                        {items.map((valueItem, index) => (
                            <View
                                // eslint-disable-next-line react/no-array-index-key
                                key={index}
                                style={{
                                    flex: 1,
                                    height: this.heightItem,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{
                                    color: value === index ? Colors.black_17 : '#909090',
                                    fontWeight: value === index ? 'bold' : '700',
                                    fontSize: value === index ? ScaleSize(20) : ScaleSize(16),
                                }}
                                >
                                    {valueItem}
                                    {/* {reversePreFix ? `${valueItem} ${preFix}` : `${preFix} ${valueItem}`} */}
                                </Text>
                            </View>
                        ))}
                        {
                            this.renderHiddenItem(this.numberItem, this.heightItem, bottomOffset)
                        }
                    </ScrollCustom>
                    <LinearGradient
                        pointerEvents="none"
                        locations={[0.2, 0.85]}
                        colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']}
                        style={{
                            height: this.heightItem * 2,
                            width,
                            position: 'absolute',
                            top: 0,
                            overflow: 'hidden'

                        }}
                    />
                    <LinearGradient
                        pointerEvents="none"
                        locations={[0, 0.85]}
                        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
                        style={{
                            height: this.heightItem * 2,
                            width,
                            position: 'absolute',
                            bottom: 0,
                            overflow: 'hidden'
                        }}
                    />
                </View>
            </View>

        );
    }
}

WheelPicker.defaultProps = {
    arrayValue: [],
    preFix: '',
    value: 0,
    heightItem: 42,
    numberItem: 5,
    bottomOffset: 0
};

module.exports = WheelPicker;
