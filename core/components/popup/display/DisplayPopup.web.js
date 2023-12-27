import React, { Component } from 'react';
import {
    View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image
} from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Text from '../../typography';
import Button from '../../button/Button';
import Colors from '../../../colors';
import { Icons } from '../../../icons';
import ValueUtils from '../../../utils/ValueUtil';
import { ColorCore } from '../../../colors/colorCore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const POPUP_WIDTH = screenWidth * 0.87;
const IMAGE_HEIGHT = POPUP_WIDTH * (160 / 327);

const styles = StyleSheet.create({
    container: {
        width: POPUP_WIDTH
    },
    body: {
        marginTop: 13,
        minHeight: IMAGE_HEIGHT,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff'
    },
    image: {
        height: IMAGE_HEIGHT,
        width: POPUP_WIDTH,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12
    },
    closeIconView: {
        position: 'absolute',
        top: 0,
        right: -12
    },
    closeIcon: {
        width: 24,
        height: 24,
        backgroundColor: 'white',
        borderRadius: 12
    },
    title: {
        // fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light_black,
    },
    content: {
        // fontSize: 16,
        color: ColorCore.black_17,
        marginTop: 12
    },
    view: {
        paddingHorizontal: 24,
        backgroundColor: 'white',
    },
    rowButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    columnButton: {
        flexDirection: 'column-reverse',
        alignItems: 'stretch'
    },
    buttonView: {
        marginTop: 12
    },
    buttonMargin: {
        marginVertical: 24
    },
    textButtonMargin: {
        marginTop: 21,
        marginBottom: 32
    },
    textActionButton: {
        marginLeft: 24,
        color: ColorCore.pink_04,
    },
    textCloseButton: {
        color: Colors.disabled
    },
    textButton: {
        fontWeight: 'bold'
    }
});

const hitSlop = {
    top: 5,
    left: 5,
    bottom: 5,
    right: 5
};

export default class DisplayPopup extends Component {
    onPressClose = () => {
        const { requestClose } = this.props;
        if (requestClose && typeof requestClose === 'function') {
            requestClose(this.close);
        } else {
            this.close();
        }
    }

    onPressIconClose = () => {
        const { requestClose } = this.props;
        if (requestClose && typeof requestClose === 'function') {
            requestClose(this.iconClose);
        } else {
            this.iconClose();
        }
    }

    iconClose = () => {
        const { onPressIconClose } = this.props;
        if (onPressIconClose && typeof onPressIconClose === 'function') onPressIconClose();
    }

    close = () => {
        const { onPressClose } = this.props;
        if (onPressClose && typeof onPressClose === 'function') onPressClose();
    }

    onPressAction = () => {
        const { requestClose } = this.props;
        if (requestClose && typeof requestClose === 'function') {
            requestClose(this.fireAction);
        } else {
            this.fireAction();
        }
    }

    fireAction = () => {
        const { onPressAction } = this.props;
        if (onPressAction && typeof onPressAction === 'function') onPressAction();
    }

    render() {
        const {
            title, content, actionButton, closeButton, buttonType,
            hideCloseIcon = false, buttonIcon, buttonRightIcon, source, renderCustomContent,
            buttons, renderButton, style, imgStyle, imgResizeMode, actionButtonType, contentStyle, requestClose,
            buttonDirection = 'column', closeButtonType = 'primary', renderCustomCloseButton,
            buttonContainerStyle, buttonSeparatorStyle, scrollViewProps
        } = this.props;
        const imageSource = ValueUtils.getImageSource(source);
        const resizeMode = imgResizeMode || 'cover';
        const imageWidth = POPUP_WIDTH - get(imgStyle, 'margin', 0) - get(imgStyle, 'marginHorizontal', 0);
        const imageHeight = IMAGE_HEIGHT - get(imgStyle, 'margin', 0) - get(imgStyle, 'marginVertical', 0);
        const maxContentHeight = screenHeight / 2 - (Object.keys(imageSource).length === 0 ? 0 : imageHeight);
        const renderCustomButton = (item, index) => renderButton(item, index, requestClose);
        const directionButtonStyle = buttonDirection === 'column' ? styles.columnButton : styles.rowButton;
        const buttonStyle = buttonDirection === 'column' ? {} : { flex: 1 };

        return (
            <View style={styles.container}>
                <View style={[styles.body, style]}>
                    {source
                        ? (
                            <Image
                                style={[styles.image, { width: imageWidth, height: imageHeight }, imgStyle]}
                                source={imageSource}
                                resizeMode={resizeMode}
                            />
                        )
                        : <View />}
                    <View style={styles.view}>
                        <ScrollView {...scrollViewProps} style={[{ maxHeight: maxContentHeight, marginTop: 18 }, contentStyle]}>
                            {!!title && <Text.H4 style={styles.title}>{title}</Text.H4>}
                            {!!content && <Text.H4 style={styles.content}>{content}</Text.H4>}
                            {renderCustomContent?.()}
                        </ScrollView>
                        <View style={closeButton ? [styles.textButtonMargin, buttonContainerStyle] : [styles.buttonMargin, buttonContainerStyle]}>
                            {!closeButton && actionButton ? (
                                <Button
                                    icon={buttonIcon}
                                    rightIcon={buttonRightIcon}
                                    onPress={this.onPressAction}
                                    type={buttonType}
                                    title={actionButton}
                                />
                            ) : <View />}
                            {
                                buttons?.length > 0 && renderButton && buttons.map(renderCustomButton)
                            }
                            {closeButton ? (
                                <View>
                                    {actionButtonType === 'button'
                                        ? (
                                            <View style={[styles.rowButton, directionButtonStyle]}>
                                                {typeof renderCustomCloseButton === 'function' ? renderCustomCloseButton(closeButton, requestClose) : (
                                                    <Button style={buttonStyle} type={closeButtonType} title={closeButton} onPress={this.onPressClose} />
                                                )}
                                                <View style={[{ width: 12, height: 20 }, buttonSeparatorStyle]} />
                                                <Button style={buttonStyle} type="primary" title={actionButton} onPress={this.onPressAction} />
                                            </View>
                                        ) : (
                                            <View style={styles.rowButton}>
                                                <TouchableOpacity
                                                    hitSlop={hitSlop}
                                                    onPress={this.onPressClose}
                                                >
                                                    <Text.H4 style={[styles.textCloseButton, styles.textButton]}>
                                                        {closeButton}
                                                    </Text.H4>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    hitSlop={hitSlop}
                                                    onPress={this.onPressAction}
                                                >
                                                    <Text.H4 style={[styles.textActionButton, styles.textButton]}>{actionButton}</Text.H4>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                </View>
                            ) : <View />}
                        </View>
                    </View>
                </View>
                {!hideCloseIcon ? (
                    <View style={styles.closeIconView}>
                        <TouchableOpacity
                            onPress={this.onPressIconClose}
                        >
                            <Image tintColor="#222222" style={styles.closeIcon} source={Icons.ic_close_24} />
                        </TouchableOpacity>
                    </View>
                ) : <View />}
            </View>
        );
    }
}

DisplayPopup.propTypes = {
    actionButton: PropTypes.string,
    buttonType: PropTypes.string,
    closeButtonType: PropTypes.string,
    closeButton: PropTypes.string,
    content: PropTypes.string,
    hideCloseIcon: PropTypes.bool,
    onPressAction: PropTypes.func,
    onPressClose: PropTypes.func,
    title: PropTypes.string,
    imgStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    contentStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    imgResizeMode: PropTypes.oneOf(['contain', 'cover', 'stretch', 'center']),
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    buttonIcon: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    buttonRightIcon: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    actionButtonType: PropTypes.oneOf(['button', 'text']),
    renderCustomContent: PropTypes.func,
    renderCustomCloseButton: PropTypes.func,
    buttonContainerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    buttonSeparatorStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    scrollViewProps: PropTypes.object,
    isInput: PropTypes.bool,
    inputProps: PropTypes.object,
    buttonDirection: PropTypes.oneOf(['column', 'row'])
};
