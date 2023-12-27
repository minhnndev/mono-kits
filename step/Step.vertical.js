import { Colors, IconSource, Image, Text } from '@momo-kits/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { IS_VALID_URL } from './Step.constants';

const CIRCLE_SIZE = 24;

const styles = StyleSheet.create({
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        borderWidth: 2,
        padding: 4,
    },
    iconImage: {
        width: 16,
        height: 16,
        position: 'absolute',
        top: 2,
        left: 2,
    },
    titleDefault: {
        color: Colors.black_12,
        fontSize: 14,
        fontWeight: 'normal',
    },
    titleActive: {
        color: Colors.black_17,
        fontSize: 14,
        fontWeight: 'bold',
    },
    container: {
        width: '100%',
        paddingRight: 48,
        marginTop: 4,
    },
    titleAndDate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    description: {
        fontSize: 12,
        color: Colors.black_12,
        marginBottom: 16,
        paddingTop: 4,
        paddingLeft: 11,
    },
    date: {
        fontSize: 10,
        color: Colors.black_12,
    },
    number: {
        fontSize: 12,
        color: 'white',
        textAlign: 'center',
        lineHeight: 13,
    },
    lineVertical: {
        marginLeft: 11,
        width: 2,
        minHeight: 10,
        marginTop: 4,
        marginBottom: 4,
        flex: 1,
    },
    minHeight: {
        minHeight: 12,
        marginBottom: 4,
    },
});

export default class VerticalStep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
        };
    }

    onLayout = (e) => {
        this.setState({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        });
    };

    /* #region  render cust */
    _renderCircleImage = ({ icon = '', circleColor, circleBorderColor }) => {
        return (
            <View>
                <View
                    style={[
                        styles.circle,
                        {
                            backgroundColor: circleColor,
                            borderColor: circleBorderColor,
                        },
                    ]}>
                    <Image
                        source={icon}
                        style={[styles.iconImage, { tintColor: '#ffffff' }]}
                    />
                </View>
            </View>
        );
    };

    _renderCircleText = ({
        circleColor = '',
        circleBorderColor = '',
        index = 0,
    }) => {
        return (
            <View>
                <View
                    style={[
                        styles.circle,
                        {
                            backgroundColor: circleColor,
                            borderColor: circleBorderColor,
                        },
                    ]}>
                    <Text style={styles.number}>{index + 1}</Text>
                </View>
            </View>
        );
    };

    _renderCircle = ({
        circleColor = '',
        circleBorderColor = '',
        isActiveState = false,
        circleUnchecked = false,
        iconActive = '',
        iconUnchecked = '',
        icon = {},
        index = 0,
    }) => {
        let resultComponent = <></>;
        if (!isActiveState) {
            if (circleUnchecked) {
                if (IS_VALID_URL.test(iconUnchecked)) {
                    resultComponent = this._renderCircleImage({
                        icon,
                        circleColor,
                        circleBorderColor,
                    });
                } else {
                    resultComponent = this._renderCircleText({
                        circleColor,
                        circleBorderColor,
                        index,
                    });
                }
            } else {
                resultComponent = this._renderCircleImage({
                    icon,
                    circleColor,
                    circleBorderColor,
                });
            }
        } else {
            // This is active case
            // If icon diff "" & regex http or https url so will render image component
            if (IS_VALID_URL.test(iconActive)) {
                resultComponent = this._renderCircleImage({
                    icon,
                    circleColor,
                    circleBorderColor,
                });
            } else {
                // Otherwise render index number in text component
                resultComponent = resultComponent = this._renderCircleText({
                    circleColor,
                    circleBorderColor,
                    index,
                });
            }
        }
        return resultComponent;
    };

    _renderLine = ({ titles = {}, index = 0, lineActive = '' }) => {
        let resultComponent = <></>;

        if (titles?.length - 1 !== index) {
            resultComponent = (
                <View
                    style={[
                        styles.lineVertical,
                        {
                            backgroundColor: lineActive,
                        },
                    ]}
                />
            );
        }
        return resultComponent;
    };

    _renderTitle = ({ textFontStyle = {}, titleStyle = {}, value = {} }) => {
        let resultComponent = (
            <View>
                <Text.Caption
                    style={[{ marginLeft: 10 }, textFontStyle, titleStyle]}>
                    {value}
                </Text.Caption>
            </View>
        );
        return resultComponent;
    };

    _renderDateOrValue = ({
        date = '',
        isActiveState = false,
        circleChecked = false,
        dateStyle = {},
        index = 0,
    }) => {
        // Init states in render function
        let resultComponent = <></>;
        if (!date) {
            return resultComponent;
        }
        if (isActiveState || circleChecked) {
            resultComponent = (
                <Text style={[styles.date, dateStyle]}>{date[index]}</Text>
            );
        }
        return resultComponent;
    };

    _renderDescription = ({ items = {}, descriptionStyle = {}, index = 0 }) => {
        let resultComponent = <></>;

        if (items) {
            resultComponent = (
                <View>
                    {typeof items[index] == 'string' ? (
                        <Text style={[styles.description, descriptionStyle]}>
                            {items[index]}
                        </Text>
                    ) : (
                        <View style={[styles.description]}>{items[index]}</View>
                    )}
                </View>
            );
        }
        return resultComponent;
    };
    /* #endregion */

    circleColumn = (value, index) => {
        const {
            currentStep,
            titles,
            iconActive,
            iconChecked,
            iconUnchecked,
            circleColorActive,
            circleColorChecked,
            circleColorUnchecked,
            circleBorderColorActive,
            circleBorderColorChecked,
            circleBorderColorUnchecked,
            lineColorActive,
            lineColorInActive,
            items,
            date,
            titleStyle,
            descriptionStyle,
            dateStyle,
        } = this.props;

        // Three circle states
        const isActiveState = currentStep == index + 1;
        const circleChecked = currentStep > index + 1;
        const circleUnchecked = currentStep < index + 1;

        // Default properties is inactive state
        let icon = {};
        let circleColor = circleColorUnchecked || Colors.black_06;
        let circleBorderColor = circleBorderColorUnchecked || Colors.black_04;
        let textFontStyle = styles.titleDefault;
        let lineActive = lineColorInActive || Colors.black_04;

        let tintColor = '#ffd6e7';

        // This is all properties in active state
        if (isActiveState) {
            icon = iconActive || index + 1;
            circleColor = circleColorActive || '#d82d8b';
            circleBorderColor = circleBorderColorActive || Colors.pink_09;
            textFontStyle = styles.titleActive;
        }

        if (circleChecked) {
            icon = iconChecked || IconSource.ic_check_24;
            lineActive = lineColorActive || tintColor;
            circleColor = circleColorChecked || '#ffadd2';
            circleBorderColor = circleBorderColorChecked || Colors.pink_09;
        }

        if (circleUnchecked) {
            icon = iconUnchecked || index + 1;
        }

        return (
            <View key={index} style={{ flexDirection: 'row' }}>
                <View>
                    {this._renderCircle({
                        circleColor,
                        circleBorderColor,
                        isActiveState,
                        circleUnchecked,
                        iconActive,
                        iconUnchecked,
                        icon,
                        index,
                    })}
                    {this._renderLine({
                        titles,
                        index,
                        lineActive,
                    })}
                </View>
                <View style={styles.container}>
                    <View style={styles.titleAndDate}>
                        {this._renderTitle({
                            textFontStyle,
                            titleStyle,
                            value,
                        })}
                        {this._renderDateOrValue({
                            date,
                            isActiveState,
                            circleChecked,
                            dateStyle,
                            index,
                        })}
                    </View>
                    {this._renderDescription({
                        items,
                        descriptionStyle,
                        index,
                    })}
                </View>
            </View>
        );
    };

    renderCircle = () => {
        const { titles = [[]] } = this.props;
        return titles.map(this.circleColumn);
    };

    render() {
        return (
            <ScrollView>
                <View onLayout={this.onLayout}>
                    <View style={[styles.circleColumn]}>
                        {this.renderCircle()}
                    </View>
                </View>
            </ScrollView>
        );
    }
}

VerticalStep.propTypes = {
    titles: PropTypes.array,
    currentStep: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    items: PropTypes.array,
    isVertical: PropTypes.bool,
    iconActive: PropTypes.any,
    iconChecked: PropTypes.any,
    iconUnchecked: PropTypes.any,
    circleColorActive: PropTypes.string,
    circleColorChecked: PropTypes.string,
    circleColorUnchecked: PropTypes.string,
    circleBorderColorActive: PropTypes.string,
    circleBorderColorChecked: PropTypes.string,
    circleBorderColorUnchecked: PropTypes.string,
    lineColorActive: PropTypes.string,
    lineColorInActive: PropTypes.string,
    titleStyle: PropTypes.object,
    descriptionStyle: PropTypes.object,
    dateStyle: PropTypes.object,
};

VerticalStep.defaultProps = {
    titles: [],
    currentStep: 0,
};
