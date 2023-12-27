import React from 'react';
import {
    Dimensions, StyleSheet, TouchableOpacity, View, Image
} from 'react-native';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import Text from '../../typography';
import Colors from '../../../colors';

const widthScreen = Dimensions.get('window').width;
const POPUP_WIDTH = widthScreen * 0.87;
const POPUP_MINHEIGHT = widthScreen / 3;

const hitSlop = {
    top: 5, left: 5, bottom: 5, right: 5
};
export default class AlertPopup extends React.Component {
    componentDidMount() {
        const { onRef } = this.props;
        if (typeof onRef === 'function') onRef(this);
    }

    close = () => {
        const { requestClose } = this.props;
        if (typeof requestClose === 'function') requestClose();
    }

    render() {
        return (
            <View style={styles.popupContainer}>
                {this.renderImageHeader()}
                {this.renderTitle()}
                {this.renderBody()}
                {this.renderFooter()}
            </View>
        );
    }

    renderImageHeader() {
        const {
            header,
            headerWrapperStyle,
            headerResizeMode,
            headerStyle,
            isLottie,
            lottieProps
        } = this.props;
        if (header) {
            return (
                <View style={[styles.defaultHeaderWrapperStyle, headerWrapperStyle]}>
                    <Image
                        resizeMode={headerResizeMode || 'contain'}
                        style={[styles.defaultHeaderStyle, headerStyle]}
                        source={header}
                    />
                </View>
            );
        }
        return null;
    }

    renderTitle() {
        const { title, header, contentStyle = {} } = this.props;
        if (!isEmpty(title)) {
            if (typeof title === 'string') {
                return (
                    <View style={[styles.headerFrame, { paddingTop: header ? 20 : 30 }]}>
                        <Text.H4 weight="bold" style={[styles.defaultTitleStyle, contentStyle.titleStyle]}>
                            {title}
                        </Text.H4>
                    </View>
                );
            }
            return title;
        }
        return null;
    }

    renderBody() {
        const {
            body, title, header, contentStyle, renderBody
        } = this.props;
        if (renderBody && typeof renderBody === 'function') {
            return (
                <View style={[styles.bodyFrame, { paddingTop: title || header ? 20 : 30 }]}>
                    {renderBody()}
                </View>
            );
        }
        if (!isEmpty(body)) {
            if (typeof body === 'string') {
                return (
                    <View style={[styles.bodyFrame, { paddingTop: title || header ? 20 : 30 }]}>
                        <Text.H4 weight="regular" style={[styles.defaultBodyStyle, contentStyle && contentStyle.bodyStyle]}>{body}</Text.H4>
                    </View>
                );
            }
            return body;
        }
        return null;
    }

    renderFooter() {
        const { buttons, buttonsDirection = 'row' } = this.props;
        if (Array.isArray(buttons)) {
            const views = [];
            for (let i = buttons.length - 1; i >= 0; i--) {
                if (buttonsDirection === 'row') {
                    views.push(this.renderFooterButton(i, buttons[i]));
                } else {
                    views.unshift(this.renderFooterButton(i, buttons[i]));
                }
            }
            return (
                <View
                    style={[
                        styles.footerFrame,
                        { flexDirection: buttonsDirection, alignSelf: 'flex-end' },
                    ]}
                >
                    {views}
                </View>
            );
        }
        return null;
    }

    renderFooterButton(index, button) {
        if (!button) return null;
        const { requestClose } = this.props;
        const { title, onPress, closeOnPress = true } = button;
        return (
            <TouchableOpacity
                hitSlop={hitSlop}
                key={`button${title}`}
                style={[styles.defaultFooterButtonFrame]}
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
                <Text.H4
                    weight="bold"
                    style={[
                        styles.defaultFooterButton,
                        { color: index === 0 ? Colors.pink_05 : Colors.black_12 },
                    ]}
                >
                    {title}
                </Text.H4>
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#00000080',
        justifyContent: 'center',
        alignItems: 'center'
    },
    popupContainer: {
        backgroundColor: '#fff', // '#fff',
        width: POPUP_WIDTH,
        minHeight: POPUP_MINHEIGHT,
        borderRadius: 8,
        overflow: 'hidden'
    },
    headerFrame: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    bodyFrame: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    footerFrame: {
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 30,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        alignSelf: 'flex-end'
    },
    defaultFooterButtonFrame: {
        marginHorizontal: 10,
        alignSelf: 'flex-end',
        marginTop: 12
    },
    defaultFooterButton: {
        color: Colors.black_12,
    },
    defaultTitleStyle: {
        fontWeight: 'bold',
        color: Colors.black_17
    },
    defaultBodyStyle: {
        color: Colors.black_17
    },
    defaultHeaderWrapperStyle: {
        width: POPUP_WIDTH,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    defaultHeaderStyle: {
        width: POPUP_WIDTH,
        height: POPUP_WIDTH / 2,
        overflow: 'hidden',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,

    }
});

AlertPopup.defaultProps = {
    headerResizeMode: 'contain',
    buttonsDirection: 'row'
};

AlertPopup.propTypes = {
    body: PropTypes.any,
    title: PropTypes.any,
    contentStyle: PropTypes.object,
    headerWrapperStyle: PropTypes.object,
    header: PropTypes.any,
    headerStyle: PropTypes.object,
    headerResizeMode: PropTypes.string,
    buttons: PropTypes.arrayOf(PropTypes.object),
    buttonsDirection: PropTypes.string,
    requestClose: PropTypes.func,
    renderBody: PropTypes.func,
    isLottie: PropTypes.bool,
    lottieProps: PropTypes.object,
};
