import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View, TouchableOpacity, StyleSheet, Dimensions,Image
} from 'react-native';
import Colors from '../../../colors';
import { Icons } from '../../../icons';
import Button from '../../button/Button';
import Text from '../../typography';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    header: {
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    headerTitle: {
        color: Colors.black_17,
        width: width - 20,
        textAlign: 'center',
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    icClose: {
        width: 24,
        height: 24,
    },
    icCloseView: {
        position: 'absolute',
        left: 15
    },
    buttonStyle: { position: 'absolute', right: 15 },
    body: {
        marginBottom: 5,
        marginHorizontal: 20
    },
    container: {
        marginBottom: 10
    }
});

const hitSlop = {
    top: 5,
    left: 5,
    right: 5,
    bottom: 5
};

export default class BottomPopupHeader extends Component {
    onClose = () => {
        const { onClose } = this.props;
        if (typeof onClose === 'function') onClose();
    }

    onButtonPress = () => {
        const { onButtonPress } = this.props;
        if (onButtonPress && typeof onButtonPress === 'function') onButtonPress();
    }

    onRightButtonPress = () => {
        const { onRightButtonPress } = this.props;
        if (onRightButtonPress && typeof onRightButtonPress === 'function') onRightButtonPress();
    }

    render() {
        const {
            title, buttonTitle = '', style, body, iconClosePosition = 'left',
            iconType = 'icon', buttonStyle, titleStyle, rightButtonTitle = '',
            rightTitleStyle, rightButtonStyle
        } = this.props;
        return (
            <View style={[styles.container, style]}>
                <View style={[styles.header]}>
                    <Text.H4 numberOfLines={2} style={styles.headerTitle}>{`${title}`}</Text.H4>
                    <View style={iconClosePosition === 'left' ? styles.icCloseView : styles.buttonStyle}>
                        <TouchableOpacity onPress={this.onClose} activeOpacity={0.5} hitSlop={hitSlop}>
                            {iconType === 'icon'
                                ? <Image style={styles.icClose} tintColor={Colors.black_17} source={Icons.ic_close_x_24} />
                                : <Text style={buttonStyle}>{buttonTitle}</Text>}
                        </TouchableOpacity>
                    </View>
                    {buttonTitle.length > 0 && iconType === 'icon' ? (
                        <Button
                            onPress={this.onButtonPress}
                            buttonStyle={[{ minHeight: 30 }, buttonStyle]}
                            title={buttonTitle}
                            titleStyle={titleStyle}
                            style={iconClosePosition ? styles.buttonStyle : styles.icCloseView}
                            size="medium"
                        />
                    ) : <View />}
                    {rightButtonTitle.length > 0 ? (
                        <Button
                            onPress={this.onRightButtonPress}
                            buttonStyle={[{ minHeight: 30 }, rightButtonStyle]}
                            title={rightButtonTitle}
                            titleStyle={rightTitleStyle}
                            style={styles.buttonStyle}
                            size="medium"
                        />
                    ) : <View />}
                </View>
                {body ? <Text.Title style={styles.body}>{body}</Text.Title> : <View />}
            </View>
        );
    }
}

BottomPopupHeader.propTypes = {
    buttonTitle: PropTypes.string,
    onButtonPress: PropTypes.func,
    onClose: PropTypes.func,
    title: PropTypes.string,
    iconClosePosition: PropTypes.oneOf(['left', 'right']),
    iconType: PropTypes.oneOf(['icon', 'text']),
    body: PropTypes.string,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    buttonStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    titleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    rightButtonTitle: PropTypes.string,
    rightButtonStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    rightTitleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onRightButtonPress: PropTypes.func
};
