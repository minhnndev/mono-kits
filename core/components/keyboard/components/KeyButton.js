import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { ColorCore } from '../../../colors/colorCore';
import FastImage from '../../image/FastImage';

const styles = StyleSheet.create({
    container: {
        marginVertical: 1.5,
        marginHorizontal: 1.5,
        borderRadius: 8,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        borderRadius: 5,
    },
});

export default class KeyButton extends Component {
    render() {
        const {
            text,
            icon,
            size,
            backgroundColor = ColorCore.black_01,
            // onPress = () => {},
            onLongPress = () => {},
            width,
            onPressOut = () => {},
            onPressIn = () => {},
            textStyle = {},
        } = this.props;
        let content = null;
        if (icon) {
            content = (
                <FastImage resizeMode="contain" source={icon} style={size} />
            );
        } else {
            content = <Text style={textStyle}>{text}</Text>;
        }
        // const buttonOnPress = () => onPress(text);
        const buttonLongPress = () => onLongPress(text);
        const buttonOnPressIn = () => onPressIn(text);
        return (
            <View
                key={text}
                style={[styles.container, { backgroundColor, width }]}>
                <TouchableOpacity
                    onPressIn={buttonOnPressIn}
                    onPressOut={onPressOut}
                    // onPress={buttonOnPress}
                    onLongPress={buttonLongPress}
                    style={styles.button}>
                    {content}
                </TouchableOpacity>
            </View>
        );
    }
}
