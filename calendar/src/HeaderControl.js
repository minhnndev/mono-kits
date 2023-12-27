import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
    View, TouchableOpacity, StyleSheet
} from 'react-native';
import moment from 'moment';
import {
    Text, Icon, Colors
} from '@momo-kits/core';
import Util from './Util';

const HeaderControl = forwardRef(({ onPressBackArrow, onPressNextArrow, selectedDate }, ref) => {
    const [info, setInfo] = useState({
        date: moment(selectedDate || new Date())
    });

    useImperativeHandle(ref, () => ({
        onUpdateInfo
    }));

    const onUpdateInfo = (date) => {
        setInfo(date);
    };

    if (info && info.date) {
        const headerFormat = `${Util.mapMonth(info.date.month() + 1)}/${info.date.year()}`;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.btnLeft}
                    onPress={onPressBackArrow}
                >
                    <Icon name="24_arrow_chevron_left_small" tintColor={Colors.black_17} style={styles.icon} />
                </TouchableOpacity>
                <Text.H4 style={styles.txtHeader}>
                    {headerFormat}
                </Text.H4>
                <TouchableOpacity
                    style={styles.btnRight}
                    onPress={onPressNextArrow}
                >
                    <Icon name="24_arrow_chevron_right_small" tintColor={Colors.black_17} style={styles.icon} />
                </TouchableOpacity>
            </View>
        );
    }
    return <View />;
});

export default HeaderControl;
const styles = StyleSheet.create({
    icon: { width: 24, height: 24, resizeMode: 'contain' },
    txtHeader: {
        // fontSize: 15,
        lineHeight: 19,
        fontWeight: 'bold',
        textAlign: 'center',
        color: Colors.black_17
    },
    btnRight: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnLeft: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        height: 36,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#edf6fe',
        alignItems: 'center',
        borderRadius: 4
    },
});
