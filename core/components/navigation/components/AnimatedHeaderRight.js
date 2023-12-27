import { LocalizedStrings, Icon, Image } from '@momo-kits/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated, Easing, TouchableOpacity, View } from 'react-native';

const LIST_TOOL = ['share', 'addFavorite', 'addShortcut'];

export default class RightHeader extends Component {
    constructor(props) {
        super(props);
        this.animated = new Animated.Value(0);
        this.state = {
            isLoading: false,
            isShowUtilityTool: false,
        };
        this.utilityToolRef = React.createRef();
        this.seeMoreRef = React.createRef();
    }

    componentDidMount() {
        const { utilityToolConfig } = this.props;
        if (typeof utilityToolConfig?.hidden === 'boolean') {
            this.setState({ isShowUtilityTool: !utilityToolConfig?.hidden });
        }
    }

    runAnimation() {
        if (this.animated) {
            const { isLoading } = this.state;
            this.animated.setValue?.(0);
            Animated.timing(this.animated, {
                toValue: 4,
                duration: 1100,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start((o) => {
                if (o.finished && isLoading) {
                    this.runAnimation();
                }
            });
        }
    }

    setLoading = (isLoading) => {
        this.setState(
            {
                isLoading,
            },
            () => this.runAnimation(),
        );
    };

    showMore = () => {
        const { onAction } = this.props;
        onAction?.();
    };

    onClose = () => {
        const { onClose } = this.props;
        onClose?.();
    };

    onUtilityToolPress = () => {
        const { onUtilityToolAction } = this.props;
        onUtilityToolAction?.((result) => {
            if (result === true) {
                this.setState({ isShowUtilityTool: false });
            }
        });
    };

    renderSeeMore() {
        return (
            <View style={styles.wrapperDot}>
                <TouchableOpacity
                    ref={this.seeMoreRef}
                    onPress={this.showMore}
                    style={styles.wrapperDotContent}
                    hitSlop={{
                        top: 10,
                        right: 10,
                        left: 10,
                        bottom: 10,
                    }}>
                    <Icon name="navigation_more_horiz" style={styles.iconDot} />
                </TouchableOpacity>
            </View>
        );
    }

    renderUtilityTool() {
        const { utilityToolConfig = {} } = this.props;
        const { type } = utilityToolConfig;
        const toolIcons = {
            share: 'https://img.mservice.com.vn/app/img/mini-app-center/share.png',
            addFavorite:
                'https://cdn.mservice.com.vn/app/img/kits/navigation_add_to_home.png',
            addShortcut:
                'https://img.mservice.com.vn/app/img/mini-app-center/phone.png',
        };
        if (!this.state.isShowUtilityTool || !LIST_TOOL.includes(type)) {
            return <View />;
        }
        return (
            <View>
                <TouchableOpacity
                    onPress={this.onUtilityToolPress}
                    ref={this.utilityToolRef}
                    style={styles.toolWrap}>
                    <Image
                        source={{ uri: toolIcons[type] }}
                        style={styles.toolIcon}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const { style } = this.props;
        return (
            <View style={styles.container}>
                {this.renderUtilityTool()}
                <View style={[styles.headerRight, style]}>
                    {this.renderSeeMore()}
                    <TouchableOpacity
                        onPress={this.onClose}
                        style={styles.closeButton}>
                        <Icon
                            name="16_navigation_close_circle"
                            style={styles.iconClose}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

RightHeader.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onAction: PropTypes.func,
    onClose: PropTypes.func,
};

const styles = {
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginLeft: 20,
        // height: 28,
    },
    wrapperDot: {
        width: '50%',
        // height: 18,
        justifyContent: 'center',
        borderRightColor: 'rgba(255, 255, 255, 0.35)',
        borderRightWidth: 1,
    },
    wrapperDotContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: { width: 4, height: 4, marginHorizontal: 1.5 },
    headerRight: {
        borderRadius: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        flexDirection: 'row',
        alignItems: 'center',
        width: 76,
        height: 28,
        marginRight: 10,
    },
    closeButton: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    iconClose: { width: 18, height: 18 },
    iconDot: { width: 24, height: 24 },
    toolWrap: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    toolIcon: { width: 18, height: 18 },
};
