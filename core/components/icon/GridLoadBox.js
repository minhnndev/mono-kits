/* eslint-disable no-unused-vars */
import React from 'react';
import {
    View, Image, Text, StyleSheet, TouchableOpacity, Clipboard, Dimensions
} from 'react-native';
import { chunk } from 'lodash';

const {width} = Dimensions.get('window');

const renderBox = (children, index = 0, onPress = null) => (
    <TouchableOpacity disabled={!onPress} onPress={onPress} style={[styles.box, { backgroundColor: index % 2 === 0 ? '#F7f7f7' : '#F7f7f7' }]}>
        {children}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    block: {
        marginLeft: 10, marginRight: 10, marginBottom: 50, marginTop: 20
    },
    viewContent: {
        padding: 15, flexDirection: 'row'
    },
    img: {
        marginLeft: 2.5,
        marginRight: 2.5,
        alignSelf: 'center',
        height: 35,
        width: 35,
        resizeMode: 'contain',
    },
    viewItemRow: {
        flexDirection: 'column', alignItems: 'center', width: 100, height: 75,  margin:5
    },
    flexRow: { flexDirection: 'row' },
    container: { width: '100%', flexWrap: 'wrap' },
    box: {
        height: 45,
        borderWidth: 0.5,
        borderColor: '#b0006d',
        paddingHorizontal: 15,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const GridLoadBox = ({ iconPack, tintColor }) => {
    const data = [];

    function push(icon_pkg) {
        /* eslint-disable guard-for-in */
        /* eslint-disable no-restricted-syntax */
        for (const key in icon_pkg) {
            data.push({ [key]: icon_pkg[key] });
        }
        if (!data) return null;
    }

    function empty() {
        data.length = 0;
    }

    const copyToClipboard = (value) => () => {
        alert(`This icon (${value}) has been copied to the clipboard `);
        Clipboard.setString(value);
    };

    return (
        <View style={{ flex: 1 }}>
            {empty()}
            {push(iconPack)}
            {chunk(chunk(data, 10), 7).map((element, index) => (
                <View key={index.toString()} style={styles.viewContent}>
                    {
                        element.map((el, idx) => (
                            <View key={idx.toString()} style={styles.block}>
                                {
                                    el.map((item, idi) => (
                                        <View key={idi.toString()} style={styles.viewItemRow}>
                                            {renderBox(<Image
                                                source={item[Object.keys(item)]}
                                                style={[styles.img, { tintColor }]}
                                            />, idi, copyToClipboard(Object.keys(item)))}
                                            {<Text style={{ width: 100, fontSize: 10,  }}>{Object.keys(item)}</Text>}
                                        </View>
                                    ))
                                }
                            </View>
                        )
                        )
                    }
                </View>
            ))}
        </View>
    );
};

export default GridLoadBox;
