import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { isEmpty } from 'lodash';
import {
    IconSource, TouchableOpacity, Text, Colors, ValueUtil, Image
} from '@momo-kits/core';
import DatePicker from './DatePicker';

const DatePickerInput = ({
    navigator, defaultDate, maxDate, minDate, format = 'dd/MM/YYYY', onSelected, onClose,
    style, textStyle, icon, iconStyle, error, disabled, minuteArray, title, showRightIcon
}) => {
    const [selected, setSelected] = useState(defaultDate || '');

    const onPress = () => {
        navigator?.showBottom?.({
            screen: DatePicker,
            params: {
                dragDisabled: true,
                minDate,
                maxDate,
                format,
                title,
                selectedDate: selected,
                onClose,
                minuteArray,
                onSelected: (dateSelected) => {
                    onSelected?.(dateSelected);
                    setSelected(dateSelected);
                },
            }
        });
    };
    let otherStyle = {};
    if (error) otherStyle = styles.error;
    if (disabled) otherStyle = styles.disabled;

    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            style={[styles.container, ValueUtil.extractStyle(style), otherStyle]}
        >
            <Text.Title style={[styles.defaultText, ValueUtil.extractStyle(textStyle), isEmpty(selected) ? { color: Colors.black_09 } : {}]}>{isEmpty(selected) ? format : selected}</Text.Title>
            {showRightIcon ? (
                <Image
                    source={icon || IconSource.ic_calendar}
                    style={[styles.icon, ValueUtil.extractStyle(iconStyle)]}
                />
            ) : <View />}
        </TouchableOpacity>
    );
};

DatePickerInput.propTypes = {
    defaultDate: PropTypes.string,
    format: PropTypes.oneOf(['hh:mm', 'MM/YYYY', 'dd/MM', 'dd/MM/YYYY']),
    icon: PropTypes.any,
    maxDate: PropTypes.string,
    minDate: PropTypes.string,
    navigator: PropTypes.object,
    onClose: PropTypes.func,
    onSelected: PropTypes.func,
    iconStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    error: PropTypes.bool,
    disabled: PropTypes.bool,
    minuteArray: PropTypes.arrayOf(PropTypes.string),
    showRightIcon: PropTypes.bool,
    title: PropTypes.string
};
DatePickerInput.defaultProps = {
    showRightIcon: true
};

export default DatePickerInput;

const styles = StyleSheet.create({
    icon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        tintColor: Colors.black_09
    },
    container: {
        flexDirection: 'row',
        height: 42,
        borderRadius: 4,
        borderColor: Colors.black_06,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        backgroundColor: Colors.black_01
    },
    error: {
        borderColor: Colors.red_05
    },
    defaultText: {
        // fontSize: 14
    },
    disabled: {
        backgroundColor: Colors.black_05,
        borderWidth: 0
    }
});