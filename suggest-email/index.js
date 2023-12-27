import React, {
    forwardRef, useEffect, useImperativeHandle, useState
} from 'react';
import {
    View, StyleSheet, TouchableOpacity, FlatList, Dimensions
} from 'react-native';
import {
    Colors, Text, Spacing, ScaleSize
} from '@momo-kits/core';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PADDING_ITEM = 2;
const SEPARATE_ITEM = 2;
const DEFAULT_HEIGHT_ITEM = 48;
const DEFAULT_EMAIL = ['@gmail.com', '@hotmail.com', '@yahoo.com'];

const styles = StyleSheet.create({
    emailBlock: {
        backgroundColor: Colors.light_blue_grey_five,
        flex: 1,
        minWidth: (SCREEN_WIDTH - PADDING_ITEM * 2 - SEPARATE_ITEM * 2) / 3,
        marginVertical: Spacing.XXS,
        paddingVertical: Spacing.XS,
        paddingHorizontal: Spacing.S,
        borderRadius: Spacing.XS,
        alignSelf: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    email: {
        textAlign: 'center',
        fontSize: ScaleSize(16),
        color: Colors.text_color_header,
    },
    separateItem: {
        width: SEPARATE_ITEM,
    },
    listContainerStyle: {
        height: DEFAULT_HEIGHT_ITEM,
        paddingHorizontal: PADDING_ITEM,
    },
});

const SuggestEmailList = (props, ref) => {
    const {
        onPress, data = DEFAULT_EMAIL, scrollEnabled = false, defaultVisible = false, style = {}
    } = props;
    const [visible, setVisible] = useState(defaultVisible);
    const [emailSuggestData, setEmailSuggestData] = useState(data);

    useEffect(() => {
        if (Array.isArray(data) && !!data?.length) setEmailSuggestData(data);
    }, [data]);

    useImperativeHandle(ref, () => ({
        show,
        hide,
    }));

    const show = () => setVisible(true);

    const hide = () => setVisible(false);

    const onPressItem = (item) => {
        if (onPress && typeof onPress === 'function') onPress(item);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => onPressItem(item)}>
            <View style={styles.emailBlock}>
                <Text style={styles.email}>{item}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderSeparateItem = () => <View style={styles.separateItem} />;

    if (!visible) return <View />;

    return (
        <View style={style}>
            <FlatList
                keyboardShouldPersistTaps="handled"
                keyExtractor={(i, index) => `${i}_${index}`}
                ItemSeparatorComponent={renderSeparateItem}
                contentContainerStyle={styles.listContainerStyle}
                data={emailSuggestData}
                renderItem={renderItem}
                horizontal
                scrollEnabled={!!scrollEnabled}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

// SuggestEmailList.propTypes = {
//     onPress: PropTypes.func,
//     style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
//     data: PropTypes.arrayOf(PropTypes.string),
//     scrollEnabled: PropTypes.bool,
//     defaultVisible: PropTypes.bool,
// };

// SuggestEmailList.defaultProps = {
//     onPress: () => { },
//     style: {},
//     data: DEFAULT_EMAIL,
//     scrollEnabled: false,
//     defaultVisible: false,
// };

export default forwardRef(SuggestEmailList);
