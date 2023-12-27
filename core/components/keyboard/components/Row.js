/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1
    }
});

export default class Row extends Component {
    render() {
        return (
            <View style={styles.container}>
                {this?.props?.children}
            </View>
        );
    }
}
