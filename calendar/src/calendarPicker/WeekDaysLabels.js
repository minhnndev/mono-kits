import React from 'react';
import { View } from 'react-native';

import { Text } from '@momo-kits/core';
import styles from './styles';
import { WEEKDAYS, } from './util';

const colorDay = '#9199a2';
const WeekDaysLabels = () => (
    <View style={styles.dayLabelsWrapper}>
        { WEEKDAYS.map((day, key) => (
            <Text.Title
                key={key.toString()}
                style={[styles.dayLabels, { color: colorDay, fontSize: 16 }]}
            >
                {day}
            </Text.Title>
        )) }
    </View>
);

export default WeekDaysLabels;
