/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
    View,
    TouchableOpacity,
    Animated,
    ScrollView,
    Easing,
    StyleSheet,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { isEqual, throttle } from 'lodash';
import { Colors, Text, Icon } from '@momo-kits/core';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default class ExpandCollapse extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
        };
        this.refRowItems = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!isEqual(nextProps.data, prevState.data)) {
            return { data: nextProps.data };
        }
        return null;
    }

    onSelect = (index) => {
        const { canExpandAll, onSelect } = this.props;
        onSelect?.(index);
        if (!canExpandAll) {
            if (this.refRowItems && this.refOld !== this.refRowItems[index]) {
                if (this.refOld) {
                    this.refOld.setStatusRow(false);
                }
                this.refOld = this.refRowItems[index];
            }
        }
    };

    renderItem = ({ item, index }) => {
        const { initialActive, expandAll, canExpandAll } = this.props;
        return (
            <ItemData
                ref={(row) => {
                    this.refRowItems[index] = row;
                    if (index === initialActive || 0) {
                        this.refOld = row;
                    }
                }}
                contents={item}
                index={index}
                isShow={
                    (expandAll && canExpandAll) || index === initialActive || 0
                }
                onPress={this.onSelect}
                key={index.toString()}
                {...this.props}
            />
        );
    };

    render() {
        const { data } = this.state;
        if (!Array.isArray(data) || data.length === 0) {
            return null;
        }

        return (
            <ScrollView
                style={styles.scrollview}
                keyboardShouldPersistTaps="always"
                {...this.props}>
                {data.map((item, index) =>
                    this.renderItem({
                        item,
                        index,
                    }),
                )}
            </ScrollView>
        );
    }
}

ExpandCollapse.propTypes = {
    onSelect: PropTypes.func,
    canExpandAll: PropTypes.bool,
    expandAll: PropTypes.bool,
    data: PropTypes.array,
    initialActive: PropTypes.number,
    renderItem: PropTypes.func,
    renderSection: PropTypes.func,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    sectionTitleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    sectionStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    sectionSubTitleStyle: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    containerItemStyle: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    isHighlight: PropTypes.bool,
};
ExpandCollapse.defaultProps = {
    canExpandAll: false,
    expandAll: false,
    data: [],
    initialActive: 0,
};

class ItemData extends PureComponent {
    constructor(props) {
        super(props);

        // this.maxHeight = 0;// props.maxHeight || 200;
        // this.isShow = props.isShow;// ,props.isShow;// true;
        this.animationView = new Animated.Value(props.isShow ? 1 : 0);
        this.state = {
            isShow: props.isShow,
            dataHeaderChanged: {},
            dataBodyChanged: {},
        };
    }

    onShow = throttle(
        () => {
            const { onPress, index } = this.props;
            // this.isShow = !this.isShow;
            onPress?.(index);
            this.setState(
                (prev) => ({ isShow: !prev.isShow }),
                () => {
                    LayoutAnimation.configureNext({
                        duration: 250,
                        create: {
                            type: LayoutAnimation.Types.easeInEaseOut,
                            property: LayoutAnimation.Properties.opacity,
                        },
                        update: { type: LayoutAnimation.Types.easeInEaseOut },
                    });
                    Animated.timing(
                        this.animationView,
                        {
                            toValue: this.state.isShow ? 1 : 0,
                            duration: 250,
                            useNativeDriver: true,
                        },
                        Easing.bounce,
                    ).start();
                },
            );
        },
        350,
        { leading: true, trailing: false },
    );

    setStatusRow = (value) => {
        // this.isShow = value;
        this.setState({ isShow: value }, () => {
            Animated.timing(
                this.animationView,
                {
                    toValue: this.state.isShow ? 1 : 0,
                    duration: 250,
                    useNativeDriver: true,
                },
                Easing.bounce,
            ).start();
        });
    };

    onChangeDataHeader = (data) => {
        this.setState({ dataHeaderChanged: data });
        // this.dataHeaderChanged = data;
        // this.forceUpdate();
    };

    onChangeDataBody = (data) => {
        this.setState({ dataBodyChanged: data });
        // this.dataBodyChanged = data;
        // this.forceUpdate();
    };

    // onLayoutAnimated = (e) => {
    //     const { isShow } = this.props;
    //     if (this.isShow && e && e.nativeEvent && e.nativeEvent.layout) { this.maxHeight = e.nativeEvent.layout.height; }
    //     if (!this.firstLoad) {
    //         if (!isShow && this.animationView) {
    //             this.isShow = false;
    //             this.animationView.setValue(0);
    //         }
    //         this.firstLoad = true;
    //         this.forceUpdate();
    //     }
    // };

    render() {
        const {
            renderHeaderSection,
            renderFooterSection,
            containerItemStyle,
            sectionStyle,
            sectionTitleStyle,
            sectionSubTitleStyle,
            renderSection,
            renderItem,
            contents,
            index,
            isHighlight,
            renderFooterCollapse,
        } = this.props;
        const { isShow, dataBodyChanged, dataHeaderChanged } = this.state;
        const deg = this.animationView.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
        });
        // const height = this.maxHeight ? this.animationView.interpolate({
        //     inputRange: [0, 1],
        //     outputRange: [0, this.maxHeight]
        // }) : undefined;

        return (
            <View
                style={[
                    styles.container,
                    containerItemStyle,
                    isHighlight && isShow && { borderColor: Colors.pink_05_b },
                ]}>
                <View style={styles.overflow}>
                    <TouchableOpacity onPress={this.onShow}>
                        <View style={[styles.sectionView, sectionStyle]}>
                            {renderSection ? (
                                renderSection(
                                    contents,
                                    index,
                                    { deg },
                                    dataHeaderChanged,
                                    this.onChangeDataBody,
                                )
                            ) : (
                                <View>
                                    <Text.Title
                                        style={[
                                            styles.title,
                                            sectionTitleStyle,
                                        ]}>
                                        {contents.title}
                                    </Text.Title>
                                    {contents.subTitle && (
                                        <Text.SubTitle
                                            style={[
                                                styles.subTitle,
                                                sectionSubTitleStyle,
                                            ]}>
                                            {contents.subTitle}
                                        </Text.SubTitle>
                                    )}
                                </View>
                            )}
                            <Animated.View
                                style={{
                                    transform: [{ rotate: deg }],
                                }}>
                                <Icon
                                    name="24_arrow_chevron_down"
                                    tintColor={Colors.black_17}
                                    style={styles.iconDown}
                                />
                            </Animated.View>
                        </View>
                        {renderFooterCollapse?.()}
                    </TouchableOpacity>
                    {renderHeaderSection
                        ? renderHeaderSection(
                              contents,
                              index,
                              { deg, animated: this.animationView },
                              dataHeaderChanged,
                              this.onChangeDataBody,
                          )
                        : null}
                    {isShow
                        ? renderItem &&
                          renderItem({
                              item: contents,
                              index,
                              dataBody: dataBodyChanged,
                              onChangeHeader: this.onChangeDataHeader,
                          })
                        : null}
                    {renderFooterSection
                        ? renderFooterSection(
                              contents,
                              index,
                              { deg, animated: this.animationView },
                              dataHeaderChanged,
                              this.onChangeDataBody,
                          )
                        : null}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    iconDown: {
        height: 16,
        width: 16,
        resizeMode: 'contain',
    },
    scrollview: {
        paddingTop: 15,
    },
    subTitle: {
        color: Colors.black_12,
    },
    title: {
        fontWeight: 'bold',
    },
    container: {
        borderWidth: 1,
        borderColor: Colors.black_04,
        marginBottom: 15,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'white',
        // shadowColor: 'rgba(0, 0, 0, 0.15)',
        // shadowOffset: {
        //     width: 1,
        //     height: 1
        // },
        // shadowRadius: 4,
        // shadowOpacity: 1,
        // elevation: 2,
    },
    sectionView: {
        flex: 1,
        paddingHorizontal: 12,
        height: 48,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    overflow: {
        overflow: 'hidden',
    },
});
