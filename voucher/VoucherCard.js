import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { get } from 'lodash';
import {
    Text, IconSource, Colors, Image, SwitchLanguage, DatetimeUtil, ValueUtil
} from '@momo-kits/core';

let pressing = false;
function debounce(callback, second = 1500) {
    if (pressing) return;
    if (!pressing) callback();
    pressing = true;
    setTimeout(() => {
        pressing = false;
    }, second);
}

const styles = StyleSheet.create({
    quantity: { left: 78, backgroundColor: Colors.background_gray, zIndex: 99 },
    container: {
        marginHorizontal: 10,
        marginTop: 10,
    },
    wrapper: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: Colors.border_light,
        minHeight: 110,
        zIndex: 1,
    },
    left: {
        width: 83,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20
    },
    remindBg: {
        backgroundColor: Colors.orange_05,
        borderRadius: 6,
        paddingHorizontal: 10,
        zIndex: 1,
        overflow: 'hidden'
    },
    remindText: {
        color: 'white',
        // fontSize: 10,
        paddingHorizontal: 3,
        paddingVertical: 2,
        fontWeight: '600'
    },
    logoBox: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Colors.border_light,
        width: 54,
        height: 54,
        padding: 1
    },
    _100: { width: '100%', height: '100%' },
    line: {
        width: 1,
        height: 87,
        alignSelf: 'center'
    },
    right: {
        flex: 1,
        padding: 15,
        paddingTop: 20,
        justifyContent: 'space-between'
    },
    amount: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#AAAAAA',
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        overflow: 'hidden'
    },
    amountText: {
        // fontSize: 10,
        padding: 4,
        color: 'white',
        fontWeight: '600'
    },
    wrapperContent: { alignSelf: 'flex-start' },
    wrapperTouch: { alignSelf: 'flex-end' },
    touchText: {
        // fontSize: 15,
        color: Colors.primary
    },
    title: {
        fontWeight: 'bold',
        fontStyle: 'normal',
        color: '#4d4d4d',
    },
    textBase: {
        fontWeight: 'normal',
        fontStyle: 'normal',
        letterSpacing: 0,
        marginVertical: 5,
        // fontSize: 12
    },
    content: {
        color: '#8f8e94',
    },
    bottom: {
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    subTitle: {
        color: '#ffb359',
    },
    circle: {
        position: 'absolute',
        borderRadius: 10,
        left: 79,
        height: 5, // change these values according to your requirement.
        width: 10,
        borderWidth: 1,
        borderColor: Colors.border_light
    },
    circleTop: {
        top: -1,
        borderTopColor: 'transparent',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    circleBottom: {
        bottom: -1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomColor: 'transparent',
    },
    shadow: {
        marginHorizontal: 10,
        height: 10,
        backgroundColor: '#E1E1E1',
        borderRadius: 5,
        marginTop: -3
    },
    logoMask: {
        position: 'absolute',
        bottom: -1,
        left: -1,
        width: 20,
        height: 20
    },
    disable: { opacity: 0.1 },
    row: {
        flexDirection: 'row'
    },
    tag: {
        width: 50,
        height: 50,
        position: 'absolute',
        left: -1,
        top: -1,
        zIndex: 2,
    },
    txtNotActiveVoucher: {
        backgroundColor: Colors.black_03,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 9,
        marginTop: 5
    },
});

export const VoucherCardType = {
    condition: 'arrConditionVoucher',
    default: 'default'
};

export default class VoucherCard extends Component {
    componentDidMount() {
        const { data, onMounted } = this.props;
        if (data) {
            const typeId = get(data, 'typeId', '');
            if (typeId && onMounted && typeof onMounted === 'function') {
                onMounted(typeId);
            }
        }
    }

    onPress = () => {
        const { onPress } = this.props;
        if (onPress && typeof onPress === 'function') {
            debounce(() => onPress());
        }
    }

    onButtonPress = () => {
        const { data, onButtonPress, disabled } = this.props;
        if (onButtonPress && typeof onButtonPress === 'function' && !disabled) {
            debounce(() => onButtonPress(data));
        }
    }

    renderButton = () => {
        const { renderCustomButton, buttonTitle, data } = this.props;
        const isDisable = (!(((new Date()).getTime() - data.startDate) > 0));
        if (typeof renderCustomButton === 'function') {
            return renderCustomButton();
        }
        if (typeof buttonTitle === 'string') {
            return (
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={this.onButtonPress}
                    style={styles.wrapperTouch}
                >
                    <Text.Title style={[styles.touchText, isDisable ? { color: Colors.third_text_color } : {}]}>
                        {buttonTitle}
                    </Text.Title>
                </TouchableOpacity>
            );
        }
        return <View />;
    }

    render() {
        const {
            data, dotColor, isSelected, isShowTag = false, iconTag = IconSource.ic_tag_voucher, tagStyle = styles.tag, disabled
        } = this.props;
        if (!data) return null;
        const {
            icon, name, desc, endDate, title, subTitle, typeDefine, quantity, startDate, status, addition
        } = data;
        const iconSource = ValueUtil.getImageSource(icon, IconSource.ic_momo);
        const remindDays = DatetimeUtil.getRemindDays(endDate);
        const isDisable = (!(((new Date()).getTime() - startDate) > 0));
        const isConditionVoucher = typeDefine && typeDefine === VoucherCardType.condition;
        const inDate = remindDays && !isDisable;
        const isRedeemVoucher = status === -1;
        const isAdditionVoucher = !!addition;
        const VoucherCardView = (
            <View>
                {isShowTag && <Image source={iconTag} style={tagStyle} />}
                <View style={[styles.wrapper, { borderColor: isSelected ? Colors.primary : Colors.border_light }]}>
                    <View style={styles.left}>
                        <View style={styles.logoBox}>
                            <Image
                                resizeMode="contain"
                                borderRadius={4}
                                source={iconSource}
                                style={[styles._100, isDisable ? styles.disable : {}]}
                            />
                            <Image source={IconSource.ic_momo_small_bottom_left} style={styles.logoMask} />
                        </View>
                    </View>
                    <Image resizeMode="contain" source={IconSource.ic_line} style={styles.line} />
                    <View style={styles.right}>
                        {quantity && (
                            <View style={styles.amount}>
                                <Text.Caption style={styles.amountText}>{`X${quantity}`}</Text.Caption>
                            </View>
                        )}
                        <View style={styles.wrapperContent}>
                            <Text.Title numberOfLines={2} style={styles.title}>{name || title}</Text.Title>
                            {
                                isConditionVoucher
                                    ? <Text.SubTitle numberOfLines={1} style={[styles.textBase, styles.subTitle]}>{desc || subTitle}</Text.SubTitle>
                                    : (
                                        <Text.SubTitle
                                            numberOfLines={1}
                                            style={[styles.textBase, styles.content]}
                                        >
                                            {`${SwitchLanguage.exp}: ${DatetimeUtil.formatMillisecondToDate(endDate)}`}
                                        </Text.SubTitle>
                                    )
                            }
                            {
                                isRedeemVoucher
                                    ? (
                                        <View style={styles.row}>
                                            <View style={styles.txtNotActiveVoucher}>
                                                <Text.Caption style={{ color: Colors.black_17 }}>
                                                    {SwitchLanguage.inActive}
                                                </Text.Caption>
                                            </View>
                                            <View />
                                        </View>
                                    )
                                    : inDate
                                        ? (
                                            <View style={styles.row}>
                                                <View style={styles.remindBg}>
                                                    <Text.Caption style={styles.remindText}>{remindDays}</Text.Caption>
                                                </View>
                                                <View />
                                            </View>
                                        ) : <View />
                            }
                                                        {
                                isAdditionVoucher && (
                                    <View style={styles.row}>
                                        <View style={styles.txtNotActiveVoucher}>
                                            <Text.Caption style={{ color: Colors.black_17 }}>
                                                {addition}
                                            </Text.Caption>
                                        </View>
                                        <View />
                                    </View>
                                )
                            }
                        </View>
                        {this.renderButton()}
                    </View>
                    <View style={[styles.circle, styles.circleTop, { backgroundColor: dotColor, borderColor: isSelected ? Colors.primary : Colors.border_light }]} />
                    <View style={[styles.circle, styles.circleBottom, { backgroundColor: dotColor, borderColor: isSelected ? Colors.primary : Colors.border_light }]} />

                </View>
            </View>
        );
        if (disabled) {
            return (
                <View style={[styles.container, { opacity: 0.5 }]}>
                    {VoucherCardView}
                </View>
            );
        }
        return (
            <TouchableOpacity
                onPress={this.onPress}
                style={styles.container}
                activeOpacity={0.5}
            >
                {VoucherCardView}
            </TouchableOpacity>
        );
    }
}

VoucherCard.propTypes = {
    data: PropTypes.shape({
        icon: PropTypes.string,
        name: PropTypes.string,
        title: PropTypes.string,
        desc: PropTypes.string,
        startDate: PropTypes.number,
        endDate: PropTypes.number,
        quantity: PropTypes.number,
        status: PropTypes.number,
        subTitle: PropTypes.string,
    }),
    renderCustomButton: PropTypes.any,
    buttonTitle: PropTypes.string,
    onMounted: PropTypes.any,
    onPress: PropTypes.any,
    onButtonPress: PropTypes.any,
    dotColor: PropTypes.string,
    isShowTag: PropTypes.bool,
    isSelected: PropTypes.bool,
    iconTag: PropTypes.string,
    tagStyle: PropTypes.object,
};

VoucherCard.defaultProps = {
    dotColor: Colors.background_gray
};
