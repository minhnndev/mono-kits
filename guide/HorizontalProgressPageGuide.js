/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, Dimensions, StyleSheet, Animated, Easing, TouchableOpacity
} from 'react-native';
import {
    Colors, Image, Text, IconSource, Button
} from '@momo-kits/core';
import ScrollableTabView from '@momo-kits/scrollable-tab-view';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const WIDTH = SCREEN_WIDTH - 20;
const CIRCLE_WIDTH = 24;
const CIRCLE_COLOR = Colors.light_blue_grey_four;
const DESCRIPTION_WIDTH = -45;
const styles = StyleSheet.create({
    container: {
        width: WIDTH,
        alignSelf: 'center',
        flex: 1,
    },
    pageContainer: {
        flex: 1,
        marginTop: 30,
        marginBottom: 20
    },
    line: {
        width: WIDTH,
        height: 2,
        backgroundColor: CIRCLE_COLOR,
        position: 'absolute',
        top: CIRCLE_WIDTH / 2 - 1,
    },
    circle: {
        width: CIRCLE_WIDTH,
        height: CIRCLE_WIDTH,
        borderRadius: CIRCLE_WIDTH / 2,
        backgroundColor: CIRCLE_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleSmall: {
        width: CIRCLE_WIDTH - 4,
        height: CIRCLE_WIDTH - 4,
        borderRadius: (CIRCLE_WIDTH - 4) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: 'white',
        left: 2,
        right: 0,
        top: 2,
        bottom: 0
    },
    absolute: {
        position: 'absolute'
    },
    stepText: {
        color: Colors.black_01,
        // fontSize: 14
    },
    page: {
        flex: 1
    },
    iconCheck: {
        width: CIRCLE_WIDTH - 5,
        height: CIRCLE_WIDTH - 5
    },
    textViewStyle: {
        width: 70,
        height: 70,
        marginTop: 5
    },
    overlayPreventDrag: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
    }
});

export default class HorizontalProgressPageGuide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStepIndex: 0,
            animatedCircleMap: {
                0: {
                    animated: false,
                    done: false
                }
            },
            showOverlay: false,
            buttonType: 'primary'
        };
        this.animatedChangeStep = new Animated.Value(0);
        this.animatedChangeStepOpacity = {};
        this.animatedChangeStepOpacity[0] = new Animated.Value(0);
    }

    renderCircle = () => {
        const { steps, progressColor } = this.props;
        const { currentStepIndex, animatedCircleMap } = this.state;
        const numberOfStep = steps.length;
        const distance = (WIDTH - CIRCLE_WIDTH) / (numberOfStep - 1);

        return steps.map((item, index) => {
            let opacity = 0;
            if (this.animatedChangeStepOpacity[index] && animatedCircleMap[index].animated) {
                opacity = this.animatedChangeStepOpacity[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                });
            }
            let textLeft = 0;
            let textViewStyle = {};
            let textStyle = {};
            if (index !== 0 && index !== numberOfStep - 1) {
                textLeft = DESCRIPTION_WIDTH / 2;
                textViewStyle = {
                    alignItems: 'center'
                };
                textStyle = {
                    textAlign: 'center'
                };
            } else if (index === numberOfStep - 1) {
                textLeft = DESCRIPTION_WIDTH;
                textViewStyle = {
                    alignItems: 'flex-end'
                };
                textStyle = {
                    textAlign: 'right'
                };
            }
            const onPress = () => this.onPressStep(index);
            return (
                <View
                    key={index.toString()}
                    style={[{ left: index * distance }, styles.absolute]}
                >
                    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
                        <Animated.View style={[
                            styles.circle,
                            index <= currentStepIndex ? { backgroundColor: progressColor } : {},
                        ]}
                        >
                            <Text.Title style={styles.stepText}>{index + 1}</Text.Title>
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.absolute}>
                        <View>
                            {animatedCircleMap[index] && animatedCircleMap[index].animated && !animatedCircleMap[index].done ? (
                                <Animated.View style={[styles.circleSmall, { opacity }]}>
                                    <Image style={[styles.iconCheck, { tintColor: progressColor }]} source={IconSource.ic_check_24} />
                                </Animated.View>
                            ) : <View />}
                            {animatedCircleMap[index] && animatedCircleMap[index].done ? (
                                <View style={[styles.circleSmall]}>
                                    <Image style={[styles.iconCheck, { tintColor: progressColor }]} source={IconSource.ic_check_24} />
                                </View>
                            ) : <View />}
                        </View>
                    </TouchableOpacity>
                    <View style={[{ left: textLeft }, styles.textViewStyle, textViewStyle]}>
                        <Text style={textStyle}>{item.name}</Text>
                    </View>
                </View>
            );
        });
    }

    onPressStep = (index) => {
        if (this.scrollTabView) {
            this.scrollTabView.goToPage(index);
        }
    }

    renderScreen = (item, index) => {
        const ComponentScreen = item.screen;
        return (
            <View style={styles.page} key={item.key || index}>
                {<ComponentScreen
                    buttonDisable={this.buttonDisable}
                    onNext={this.onNext}
                    onBack={this.onBack}
                    onDone={this.onDone}
                /> || <View />}
            </View>
        );
    }

    onDone = () => {
        const { onDone } = this.props;
        if (onDone && typeof onDone === 'function') onDone();
    }

    onNext = () => {
        const { currentStepIndex, buttonType } = this.state;
        if (buttonType === 'disabled') return;
        const { steps } = this.props;
        if (currentStepIndex === steps.length - 1) {
            this.onDone();
        } else if (this.scrollTabView) {
            this.scrollTabView.goToPage(Math.min(currentStepIndex + 1, steps.length - 1));
        }
    }

    onBack = () => {
        const { currentStepIndex } = this.state;
        if (this.scrollTabView) {
            this.scrollTabView.goToPage(Math.max(0, currentStepIndex - 1));
        }
    }

    onScrollTab = (position) => {
        const { duration } = this.props;
        const { currentStepIndex, animatedCircleMap } = this.state;
        const positivePosition = Math.max(0, position);
        if (Math.floor(positivePosition) !== currentStepIndex) {
            const newIndex = Math.floor(positivePosition);
            const circleIndexAnimation = newIndex > currentStepIndex ? Math.max(newIndex - 1, 0) : newIndex;
            if (!this.animatedChangeStepOpacity[circleIndexAnimation]) {
                this.animatedChangeStepOpacity[circleIndexAnimation] = new Animated.Value(0);
            }
            const newAnimatedCircleMap = JSON.parse(JSON.stringify(animatedCircleMap));
            const opacityToValue = newIndex > currentStepIndex ? 1 : 0;
            newAnimatedCircleMap[circleIndexAnimation] = {
                animated: true, // next
                done: false,
                opacity: opacityToValue
            };
            this.setState({ currentStepIndex: newIndex, animatedCircleMap: newAnimatedCircleMap, showOverlay: true });
            Animated.parallel([
                Animated.timing(this.animatedChangeStep, {
                    toValue: newIndex,
                    duration: duration / 2,
                    easing: Easing.ease,
                    useNativeDriver: false
                }),
                Animated.timing(this.animatedChangeStepOpacity[circleIndexAnimation], {
                    toValue: newAnimatedCircleMap[circleIndexAnimation].opacity,
                    duration,
                    easing: Easing.ease,
                    useNativeDriver: true
                })
            ]).start(() => {
                setTimeout(() => {
                    const tempAnimatedCircleMap = JSON.parse(JSON.stringify(this.state.animatedCircleMap));
                    tempAnimatedCircleMap[circleIndexAnimation] = {
                        animated: false,
                        done: newIndex > currentStepIndex,
                        opacity: newIndex > currentStepIndex ? 1 : 0
                    };
                    this.setState({ animatedCircleMap: tempAnimatedCircleMap, showOverlay: false });
                    const { onChangePage } = this.props;
                    if (onChangePage && typeof onChangePage === 'function') onChangePage(newIndex);
                }, 100);
            });
        }
    }

    buttonDisable = (disable) => {
        this.setState({ buttonType: disable ? 'disabled' : 'primary' });
    }

    render() {
        const {
            steps, progressColor, pageContainerStyle, buttonTitleNext, buttonTitleDone, onIndexChanged = () => { }
        } = this.props;
        const { currentStepIndex, buttonType } = this.state;
        if (!steps || !Array.isArray(steps)) return <View />;
        const numberOfStep = steps.length - 1;
        const { showOverlay } = this.state;
        const width = this.animatedChangeStep.interpolate({
            inputRange: [0, numberOfStep],
            outputRange: [0, WIDTH]
        });

        const buttonValue = currentStepIndex === numberOfStep ? buttonTitleDone : buttonTitleNext;
        const onChangeTab = (e) => onIndexChanged(e.i);
        return (
            <View style={styles.container}>
                <View style={styles.line} />
                <Animated.View style={[styles.line, { backgroundColor: progressColor }, { width }]} />
                {this.renderCircle()}
                <ScrollableTabView
                    ref={(ref) => this.scrollTabView = ref}
                    scrollEventThrottle={200}
                    onChangeTab={onChangeTab}
                    onScroll={this.onScrollTab}
                    style={[styles.pageContainer, pageContainerStyle]}
                    tabBarBackgroundColor="transparent"
                    tabBarUnderlineStyle={{ backgroundColor: 'transparent' }}
                >
                    {steps.map(this.renderScreen)}
                </ScrollableTabView>
                {buttonValue ? (
                    <Button
                        type={buttonType}
                        title={buttonValue}
                        onPress={this.onNext}
                    />
                ) : <View />}
                {showOverlay ? <View style={styles.overlayPreventDrag} /> : <View />}
            </View>
        );
    }
}

HorizontalProgressPageGuide.propTypes = {
    buttonTitleDone: PropTypes.string,
    buttonTitleNext: PropTypes.string,
    duration: PropTypes.number,
    onChangePage: PropTypes.func,
    onDone: PropTypes.func,
    pageContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    progressColor: PropTypes.string,
    steps: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        screen: PropTypes.func
    })),
    onIndexChanged: PropTypes.func
};

HorizontalProgressPageGuide.defaultProps = {
    duration: 300,
    progressColor: Colors.green_05
};
