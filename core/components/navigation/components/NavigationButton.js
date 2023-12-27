/* eslint-disable react/no-unused-prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import {
    Platform, Animated, StyleSheet, View
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { throttle } from 'lodash';
import Image from 'react-native-fast-image';
import imgs from '../assets/imgs';
import Text from '../../typography';
import Colors from '../../../colors';
import ValueUtil from '../../../utils/ValueUtil';
import Icon from '../../icon/Icon';

const defaultIcon = Platform.OS === 'ios' ? imgs.ic_back_ios : imgs.ic_back_android;

const AnimatedImage = Animated.createAnimatedComponent(Image);

const AnimatedText = Animated.createAnimatedComponent(Text);

const isImage = (source) => {
    const isLocalImage = typeof source === 'number' || (typeof source?.uri === 'string' && !source?.uri?.startsWith('http'));
    const isUrlImage = typeof source?.uri === 'string' && source?.uri?.startsWith('http') || typeof source === 'string' && source?.startsWith('http');
    return isLocalImage || isUrlImage;
};
export default class NavigationButton extends React.Component {
    renderItem = ({
        title, titleStyle, icon, iconStyle, tintColor = '#fff', color
    }) => {
        if (title) {
            return (
                <AnimatedText style={[{ fontSize: 16, color: color || tintColor || '#fff' }, titleStyle]}>
                    {title}
                </AnimatedText>
            );
        }
        if (icon) {
            return isImage(icon) ? (
                <AnimatedImage
                    source={ValueUtil.getImageSource(icon) || ValueUtil.getImageSource(defaultIcon)}
                    style={[{ width: 24, height: 24, tintColor: color || tintColor || '#fff' }, iconStyle]}
                    tintColor={color || tintColor || '#fff'}
                />
            ) : (
                <Icon
                    name={icon}
                    style={[{ width: 24, height: 24, tintColor: color || tintColor || '#fff' }, iconStyle]}
                    tintColor={color || tintColor || '#fff'}
                />
            );
        }
        return null;
    }

    onPress = (action) => throttle(() => {
        action && action();
    }, 1000, { leading: true, trailing: false });

    _getBadge = (badge) => (badge >= 100 ? '99+' : badge);

    renderBadge({ badge, badgeStyle, titleBadgeStyle }) {
        if (!badge) return null;
        return (
            <View pointerEvents="none" style={[styles.viewBadge, badgeStyle]}>
                <Text.Caption numberOfLines={1} style={[{ color: Colors.white }, titleBadgeStyle]}>{this._getBadge(badge)}</Text.Caption>
            </View>
        );
    }

    renderContent(item) {
        return (
            <View key={item?.index ? item?.index?.toString() : 0} style={item.containerStyle}>
                <TouchableOpacity
                    activeOpacity={0.85}
                    hitSlop={styles.hitSlop}
                    style={[item.style, { justifyContent: 'center' }]}
                    onPress={this.onPress(item.onPress)}
                >
                    {this.renderItem(item)}
                </TouchableOpacity>
                {this.renderBadge(item)}
            </View>
        );
    }

    render() {
        const { tintColor, data, color } = this.props;
        if (data) {
            return (
                <View style={styles.container}>
                    {
                        data.map((item, index) => this.renderContent({
                            ...item, color, tintColor, index
                        }))
                    }
                </View>
            );
        }
        return this.renderContent({ ...this.props });
    }
}

NavigationButton.propTypes = {
    data: PropTypes.array,
    onPress: PropTypes.func,
    tintColor: PropTypes.string,
    color: PropTypes.any,
    containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.shape({ uri: PropTypes.string })]),
    iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    title: PropTypes.string,
    titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    badge: PropTypes.number,
    badgeStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    titleBadgeStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    hitSlop: {
        top: 10, left: 10, bottom: 10, right: 10
    },
    viewBadge: {
        borderRadius: 3,
        backgroundColor: '#fa8613',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        right: 10,
        paddingHorizontal: 3,
    }
});
