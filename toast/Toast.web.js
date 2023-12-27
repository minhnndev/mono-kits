import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Animated,
    TouchableOpacity,
    Image
} from 'react-native';
import Text from '../../core/components/typography';
import Colors from '../../core/colors';

const DISPLAY_DURATION = 300;
const ic_oval_failure = require('./img/ic_oval_failure.png');
const ic_oval_success = require('./img/ic_oval_success.png');

const KEY_SUCCESS = 'success';
const KEY_FAILURE = 'failure';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        overflow: 'hidden',
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
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: Colors.text_color_header,
        opacity: 0.95
    },
    icon: {
        width: 45,
        height: 45,
        marginRight: 12
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    title: {
        color: Colors.white,
        fontWeight: 'bold'
    },
    description: {
        color: Colors.white,
    },
    undoTitleStyle: {
        color: Colors.black_01,
        marginRight: 2.5,
        marginLeft: 16.5
    },
    undoRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    line: {
        height: 32,
        width: 1,
        backgroundColor: Colors.white,
        opacity: 0.25
    }
});

export default class Toast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animation: new Animated.Value(0),
            isShowing: false
        };
    }

    static LENGTH_SHORT = 2000;

    static LENGTH_LONG = 3500;

    animate = (duration) => {
        const { animation } = this.state;
        Animated.timing(animation, {
            toValue: 1,
            duration: DISPLAY_DURATION
        }).start(() => {
            Animated.timing(animation, {
                toValue: 1,
                duration
            }).start(() => {
                Animated.timing(animation, {
                    toValue: 0,
                    duration: DISPLAY_DURATION
                }).start(() => {
                    this.setState({
                        isShowing: false
                    }, () => {
                        this.onToastClosed();
                    });
                });
            });
        });
    }

    show = ({
        icon,
        title,
        description,
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
            this.setState({
                isShowing: true,
                icon: toastIcon,
                title,
                description,
                onClose,
                style,
                iconStyle,
                titleStyle,
                descriptionStyle,
                undoTitle,
                onUndoPress
            }, () => {
                this.animate(duration);
            });
        }
    }

    onToastClosed = () => {
        const { onClose } = this.state;
        onClose?.();
    }

    onUndoPress = () => {
        const { onUndoPress, animation } = this.state;
        Animated.timing(animation, {
            toValue: 0,
            duration: DISPLAY_DURATION
        }).start(() => {
            this.setState({
                isShowing: false
            }, () => {
                this.onToastClosed();
            });
        });
        onUndoPress?.();
    }

    renderBody = () => {
        const {
            style,
            iconStyle,
            titleStyle,
            descriptionStyle,
            icon,
            title,
            description,
            undoTitle
        } = this.state;

        return (
            <View style={[styles.body, style]}>
                {icon && <Image style={[styles.icon, iconStyle]} source={icon} />}
                <View style={styles.textContainer}>
                    {title && <Text.Title style={[styles.title, titleStyle]}>{title}</Text.Title>}
                    {description && <Text.Title style={[styles.description, descriptionStyle]}>{description}</Text.Title>}
                </View>
                {undoTitle && (
                    <TouchableOpacity onPress={this.onUndoPress}>
                        <View style={styles.undoRow}>
                            <View style={styles.line} />
                            <Text.Title weight="bold" style={styles.undoTitleStyle}>{undoTitle}</Text.Title>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    render() {
        const { animation, isShowing } = this.state;
        const animatedStyle = {
            opacity: animation
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

Toast.propTypes = {

};
