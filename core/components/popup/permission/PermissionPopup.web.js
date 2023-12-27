/* eslint-disable no-lonely-if */
import React, { Component } from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Image
} from 'react-native';
import PropTypes from 'prop-types';
import Text from '../../typography';
import { Icons } from '../../../icons';

const widthScreen = Dimensions.get('window').width;

class PermissionPopup extends Component {
    constructor(props) {
        super(props);
    }

    closePopup = () => {
        const { onClose } = this.props;
        if (onClose && typeof onClose === 'function') {
            onClose();
        }
    };

    onPress = () => {
        const { onPress, closeOnPress } = this.props;
        closeOnPress && this.closePopup();
        if (onPress && typeof onPress === 'function') {
            onPress();
        }
    }

    renderContentHeader() {
        const {
            title, header, message, content,
        } = this.props;
        return (
            <View>
                <Text.H4 style={styles.title}>{title}</Text.H4>
                {
                    header ? (
                        <Image
                            style={styles.imageBody}
                            source={header}
                        />
                    ) : null

                }

                <Text.Title style={styles.message}>{message}</Text.Title>
                <View>
                    <Text.Title
                        style={[styles.message, { marginTop: 5 }]}
                    >
                        {content ? (content + Platform.select({
                            android: 'Allow',
                            ios: 'OK'
                        })) : ''}
                    </Text.Title>
                    <Text.Title style={[styles.message, { marginTop: 5 }]}>Hoặc:</Text.Title>
                </View>
            </View>
        );
    }

    renderContent() {
        const { steps } = this.props;
        const array = steps ? Platform.select(steps) : [];
        if (array && Array.isArray(array) && array.length > 0) {
            return array.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                    <Image style={{ width: 29, height: 29, resizeMode: 'contain' }} source={item.icon} />
                    <Text.Title style={{
                        flex: 1, color: '#4D4D4D', marginLeft: 10
                    }}
                    >
                        {item.text}
                    </Text.Title>
                </View>
            ));
        }
        return null;
    }

    renderCTA() {
        const { buttonTitle } = this.props;
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                <TouchableOpacity style={styles.button} onPress={this.onPress}>
                    <Text.Title style={styles.text}>{buttonTitle}</Text.Title>
                </TouchableOpacity>
            </View>
        );
    }

    renderCloseButton() {
        return (
            <TouchableOpacity

                style={styles.positionCloseIc}
                onPress={this.closePopup}
            >
                <Image style={styles.icon} source={Icons.ic_close_24} />
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.closePopup}>
                <View style={styles.container}>
                    <View>
                        <View style={styles.content}>
                            {this.renderContentHeader()}
                            {this.renderContent()}
                            {this.renderCTA()}
                            {this.renderCloseButton()}
                        </View>

                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const imageBodyWidth = widthScreen - 28;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 24,
        paddingRight: 12
    },
    containerCTA: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    content: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        marginTop: 12,
        marginRight: 12,
        width: widthScreen - 48,
        overflow: 'hidden',
    },
    icon: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
        tintColor: '#222222'

    },

    positionCloseIc: {
        position: 'absolute',
        right: 10,
        top: 10
    },

    imageBody: {
        width: imageBodyWidth,
        height: imageBodyWidth * 160 / 327,
        resizeMode: 'contain',
        marginBottom: 12,
    },
    title: {
        // fontSize: 16,
        color: '#4D4D4D',
        fontWeight: 'bold',
        marginBottom: 13,
        fontFamily: 'System'
    },
    message: {
        // fontSize: 15,
        color: '#4D4D4D'
    },
    button: {
        width: widthScreen - 80,
        height: 54,
        backgroundColor: '#F1F5FB',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        // fontSize: 15,
        color: '#B0006D',
        fontWeight: 'bold'
    },
    textClose: {
        fontSize: 15,
        color: '#8F8E94',
        fontWeight: 'bold'
    },
    iconClose: { position: 'absolute', alignSelf: 'flex-end' }
});

PermissionPopup.propTypes = {
    buttonTitle: PropTypes.string,
    closeOnPress: PropTypes.bool,
    content: PropTypes.string,
    header: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
    onPress: PropTypes.func,
    steps: PropTypes.object,
    title: PropTypes.string
};

PermissionPopup.defaultProps = {
    closeOnPress: true,
    buttonTitle: 'Cho phép truy cập',
    header: null,
    message: '',
    title: ''
};

export default PermissionPopup;
