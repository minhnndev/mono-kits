import React, { Component } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity } from 'react-native';
import { Text, Colors, Image } from '@momo-kits/core';

const DISPLAY_DURATION = 300;
const ic_oval_failure = require('./img/ic_oval_failure.png');
const ic_oval_success = require('./img/ic_oval_success.png');

const KEY_SUCCESS = 'success';
const KEY_FAILURE = 'failure';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        overflow: 'hidden',
        alignSelf: 'center',
        bottom: 0,
        width: '100%',
    },
    body: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 30,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: Colors.text_color_header,
        opacity: 0.95,
    },
    icon: {
        width: 32,
        height: 32,
        marginRight: 8,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        color: Colors.white,
        // fontWeight: 'bold',
    },
    // description: {
    //     color: Colors.white,
    // },
    undoTitleStyle: {
        color: Colors.black_01,
        marginLeft: 12,
    },
    undoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    line: {
        height: 32,
        width: 1,
        backgroundColor: Colors.white,
        opacity: 0.25,
        marginLeft: 1,
    },
});

export default class Toast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animation: new Animated.Value(0),
            isShowing: false,
        };
    }

    static LENGTH_SHORT = 2000;

    static LENGTH_LONG = 3500;

    animate = (duration) => {
        const { animation } = this.state;
        Animated.timing(animation, {
            toValue: 1,
            duration: DISPLAY_DURATION,
            useNativeDriver: true,
        }).start(() => {
            Animated.timing(animation, {
                toValue: 1,
                duration,
                useNativeDriver: true,
            }).start(() => {
                Animated.timing(animation, {
                    toValue: 0,
                    duration: DISPLAY_DURATION,
                    useNativeDriver: true,
                }).start(() => {
                    this.setState(
                        {
                            isShowing: false,
                        },
                        () => {
                            this.onToastClosed();
                        },
                    );
                });
            });
        });
    };

    show = ({
        icon,
        title,
        duration = this.LENGTH_SHORT,
        type,
        onClose,
        style,
        iconStyle,
        titleStyle,
        descriptionStyle,
        undoTitle,
        onUndoPress,
    }) => {
        const { isShowing } = this.state;
        let toastIcon = icon;
        if (type === KEY_SUCCESS) {
            toastIcon = ic_oval_success;
        } else if (type === KEY_FAILURE) {
            toastIcon = ic_oval_failure;
        }
        if (!isShowing) {
            this.setState(
                {
                    isShowing: true,
                    icon: toastIcon,
                    title,
                    onClose,
                    style,
                    iconStyle,
                    titleStyle,
                    descriptionStyle,
                    undoTitle,
                    onUndoPress,
                },
                () => {
                    this.animate(duration);
                },
            );
        }
    };

    onToastClosed = () => {
        const { onClose } = this.state;
        onClose?.();
    };

    onUndoPress = () => {
        const { onUndoPress, animation } = this.state;
        Animated.timing(animation, {
            toValue: 0,
            duration: DISPLAY_DURATION,
            useNativeDriver: true,
        }).start(() => {
            this.setState(
                {
                    isShowing: false,
                },
                () => {
                    this.onToastClosed();
                },
            );
        });
        onUndoPress?.();
    };

    renderBody = () => {
        const { style, iconStyle, titleStyle, icon, title, undoTitle } =
            this.state;

        return (
            <View style={[styles.body, style]}>
                {icon ? (
                    <Image style={[styles.icon, iconStyle]} source={icon} />
                ) : null}
                <View style={styles.textContainer}>
                    {title ? (
                        <Text.Title
                            style={[styles.title, titleStyle]}
                            numberOfLines={2}>
                            {title}
                        </Text.Title>
                    ) : null}
                    {/* {description ? (
                        <Text.Title
                            style={[styles.description, descriptionStyle]}>
                            {description}
                        </Text.Title>
                    ) : null} */}
                </View>
                {undoTitle ? (
                    <TouchableOpacity onPress={this.onUndoPress}>
                        <View style={styles.undoRow}>
                            <View style={styles.line} />
                            <Text.Title
                                weight="bold"
                                style={styles.undoTitleStyle}>
                                {undoTitle}
                            </Text.Title>
                        </View>
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    };

    render() {
        const { animation, isShowing } = this.state;
        const animatedStyle = {
            opacity: animation,
        };
        if (isShowing) {
            return (
                <Animated.View style={[styles.container, animatedStyle]}>
                    {this.renderBody()}
                </Animated.View>
            );
        }
        return null;
    }
}

Toast.propTypes = {};
