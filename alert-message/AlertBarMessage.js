import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, StyleSheet, Dimensions,
    TouchableOpacity, LayoutAnimation, Image
} from 'react-native';
import { Text, Button } from '@momo-kits/core';

const { width: screenWidth } = Dimensions.get('window');
let ALERT_BAR_HEIGHT = 70;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        width: screenWidth,
        position: 'absolute',
        flexDirection: 'row',
        overflow: 'hidden',
        top: 0,
        zIndex: 10000
    },
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    message: {
        marginRight: 10,
        flex: 1,
        color: '#4d4d4d',
        alignSelf: 'center',
        // fontSize: 14
    },
    icClose: {
        width: 20,
        height: 20,
        tintColor: '#4d4d4d'
    },
    body: {
        flex: 1,
        padding: 15,
        backgroundColor: '#FFE400',
    },
    buttonStyle: {
        borderColor: '#4d4d4d',
        marginTop: 10,
        maxWidth: 100
    },
    buttonTitleStyle: {}
});

export default class AlertBarMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            alertBarHeight: 0
        };
        this.isShowing = false;
    }

    show = (message, height) => {
        if (this.isShowing) return;
        if (this.showProgressBarTimeout) clearTimeout(this.showProgressBarTimeout);
        this.isShowing = true;
        const { alertBarHeight } = this.state;
        if (alertBarHeight === 0) {
            LayoutAnimation.spring();
        }

        if (height != null && height !== 0) {
            this.setState({
                alertBarHeight: height,
                message,
            });
            ALERT_BAR_HEIGHT = height;
        } else {
            this.setState({
                alertBarHeight: ALERT_BAR_HEIGHT,
                message,
            });
            ALERT_BAR_HEIGHT = 70;
        }
        const { duration, autoClose } = this.props;
        if (autoClose) {
            this.showProgressBarTimeout = setTimeout(this.hideAlertBar, duration);
        }
    }

    componentWillUnmount() {
        if (this.showProgressBarTimeout) clearTimeout(this.showProgressBarTimeout);
    }

    hide = () => this.hideAlertBar();

    hideAlertBar = () => {
        const { alertBarHeight } = this.state;
        if (alertBarHeight > 0) {
            this.isShowing = false;
            LayoutAnimation.spring();
            this.setState({
                alertBarHeight: 0,
                message: '',
            });
        }
    }

    render() {
        const {
            style, messageStyle, icon, iconStyle, renderBody, buttonTitle, buttonStyle,
            onButtonPress, direction, hideCloseIcon, bodyStyle
        } = this.props;
        const { alertBarHeight, message } = this.state;
        const flexDirection = direction === 'row' ? 'row' : 'column';

        return (
            <View style={[styles.container, style]}>
                <View style={[styles.body, { marginTop: alertBarHeight - ALERT_BAR_HEIGHT, flexDirection }, bodyStyle]}>
                    {typeof renderBody === 'function' ? renderBody() : (
                        <View style={styles.view}>
                            <Text.Title style={[styles.message, messageStyle]}>
                                {message}
                            </Text.Title>
                            {hideCloseIcon ? <View /> : (
                                <TouchableOpacity onPress={this.hideAlertBar}>
                                    <Image
                                        style={[styles.icClose, iconStyle]}
                                        source={icon}
                                    />
                                </TouchableOpacity>
                            )}

                        </View>
                    )}
                    {buttonTitle ? (
                        <Button
                            onPress={onButtonPress}
                            size="large"
                            type="primaryBorder"
                            title={buttonTitle}
                            buttonStyle={[styles.buttonStyle, buttonStyle]}
                            titleStyle={styles.buttonTitleStyle}
                        />
                    ) : <View />}
                </View>

            </View>
        );
    }
}

AlertBarMessage.propTypes = {
    duration: PropTypes.number,
    icon: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
        uri: PropTypes.string
    })]),
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    messageStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    autoClose: PropTypes.bool,
    direction: PropTypes.oneOf(['column', 'row']),
    buttonTitle: PropTypes.string,
    buttonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    bodyStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onButtonPress: PropTypes.func,
    hideCloseIcon: PropTypes.bool
};

AlertBarMessage.defaultProps = {
    duration: 7000,
    icon: { uri: 'https://img.mservice.io/momo_app_v2/new_version/img/appx_icon/24_navigation_close.png' },
    autoClose: true,
    direction: 'column'
};
