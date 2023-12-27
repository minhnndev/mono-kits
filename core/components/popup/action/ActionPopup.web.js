/**
 * Created by anbui on 12/12/17.
 */
import PropTypes from 'prop-types';
import React from 'react';
import {
    StyleSheet, Dimensions, View, TouchableOpacity,
} from 'react-native';
import { get } from 'lodash';
import { ifIphoneX } from '../../../utils/ScreenUtils';
import Colors from '../../../colors';
import Text from '../../typography';

const widthScreen = Dimensions.get('window').width;

const styles = StyleSheet.create({
    containerStyle: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: ifIphoneX(24, 0)
    },
    closeButtonDefaultTextStyle: {
        color: '#4A90E2',
        fontSize: 18,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    buttonDefaultTextStyle: {
        color: Colors.primary,
        fontSize: 18,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    subTextDefaultTextStyle: {
        color: '#222222',
        // fontSize: 15,
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    closeButtonDefaultContainerStyle: {
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        width: widthScreen - 20,
        height: 48,
        flexDirection: 'column',
        alignItems: 'center',
        borderWidth: 0,
        marginBottom: 10,
    },
    buttonDefaultContainerStyle: {
        backgroundColor: '#FFFFFF',
        width: widthScreen - 20,
        minHeight: 48,
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    titleContainerStyle: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        borderWidth: 0,
        paddingBottom: 0,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5
    },
    titleViewStyle: {
        width: widthScreen - 20,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0
    },
    titleLabelStyle: {
        color: '#222222',
        // fontSize: 18,
        textAlign: 'center'
    },
    titleUnderLineStyle: {
        padding: 0,
        width: widthScreen - 20
    },
    button: {
        minHeight: 48,
        width: widthScreen - 20,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    buttonEmpty: {
        minHeight: 48,
        width: widthScreen - 20,
        backgroundColor: 'transparent',
    },
    buttonGroupContainer: {
        borderRadius: 10, marginBottom: 5, overflow: 'hidden'
    }
});

export default class ActionPopup extends React.Component {
    renderButton = (button) => {
        const { requestClose } = this.props;
        if (button) {
            const {
                title = '', subTitle = '', onPress = null, closeOnPress = true
            } = button;
            return (
                <View key={button.key} style={button.containerStyle}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.button}
                        onPress={() => {
                            if (closeOnPress && typeof requestClose === 'function') {
                                requestClose(() => {
                                    onPress && onPress();
                                });
                            } else {
                                onPress && onPress();
                            }
                        }}
                    >
                        <Text style={button.textStyle}>
                            {title}
                        </Text>
                        {
                            subTitle ? (
                                <Text.Title style={styles.subTextDefaultTextStyle}>{subTitle}</Text.Title>
                            ) : <View />
                        }
                    </TouchableOpacity>
                    {
                        button.showBottomLine ? (
                            <View style={{ backgroundColor: '#E6E6E6', width: '100%', height: 1 }} />
                        ) : <View />
                    }
                </View>
            );
        }
        return null;
    }

    renderCloseButton = () => {
        const { buttons } = this.props;
        const closeButton = get(buttons, '[0]', null);
        if (!closeButton) return <View />;
        if (closeButton.component) {
            return (
                <View style={styles.buttonEmpty}>
                    {closeButton.component}
                </View>
            );
        }
        const { title, onPress } = closeButton;
        const closeButtonRender = {
            key: 'close',
            title,
            onPress,
            containerStyle: styles.closeButtonDefaultContainerStyle,
            textStyle: styles.closeButtonDefaultTextStyle,
        };
        return this.renderButton(closeButtonRender);
    }

    renderArrayButton = () => {
        const { buttons } = this.props;

        if (buttons) {
            const views = [];
            for (let i = buttons.length - 1; i >= 1; i--) {
                const button = buttons[i];
                if (button.component) {
                    views.push(<View style={styles.buttonEmpty}>{button.component}</View>);
                } else {
                    const convertButton = {
                        key: i,
                        title: button.title ? button.title : i,
                        subTitle: button.subTitle ? button.subTitle : null,
                        containerStyle: [
                            styles.buttonDefaultContainerStyle,
                            button.containerStyle,
                        ],
                        textStyle: [styles.buttonDefaultTextStyle, button.textStyle],
                        onPress: button.onPress,
                        showBottomLine: i === buttons.length - 1 ? false : (button.showBottomLine !== undefined ? button.showBottomLine : true)
                    };
                    views.push(this.renderButton(convertButton));
                }
            }
            return views;
        }
        return null;
    }

    renderTitle = () => {
        const {
            title, titleStyle, titleViewStyle, titleUnderLineStyle
        } = this.props;
        return (
            title
                ? (
                    <View key="title" style={styles.titleContainerStyle}>
                        <View style={[styles.titleViewStyle, titleViewStyle]}>
                            <Text.H4 style={[styles.titleLabelStyle, titleStyle]}>
                                {title}
                            </Text.H4>
                        </View>
                        <View style={[styles.titleUnderLineStyle, titleUnderLineStyle]}>
                            <View style={{ backgroundColor: '#E6E6E6', width: '100%', height: 1 }} />
                        </View>
                    </View>
                )
                : null
        );
    }

    render() {
        const { containerStyle } = this.props;
        return (
            <View style={[styles.containerStyle, containerStyle]}>
                <View style={styles.buttonGroupContainer}>
                    {this.renderTitle()}
                    {this.renderArrayButton()}
                </View>
                {this.renderCloseButton()}
            </View>
        );
    }
}

ActionPopup.propTypes = {
    buttons: PropTypes.any,
    containerStyle: PropTypes.any,
    requestClose: PropTypes.func,
    title: PropTypes.string,
    titleStyle: PropTypes.any,
    titleViewStyle: PropTypes.any,
    titleUnderLineStyle: PropTypes.any,
};
