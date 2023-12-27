import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, Spacing } from '@momo-kits/core';

const DotChart = ({
    dotColor = '',
    name=  '',
    size = Spacing.S
}) => {
    return (
        <View style={styles.dotContainer} >
            <View style={[styles.dot(size), { backgroundColor: dotColor }]} />
            <Text.SubTitle> {name} </Text.SubTitle>
        </View>
    )
}

export default DotChart

const styles = StyleSheet.create({
    dotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.M,
    },
    dot(size) {
        return {
            width: size,
            height: size,
            borderRadius:size,
            marginHorizontal: Spacing.S,
        }
    }
})
