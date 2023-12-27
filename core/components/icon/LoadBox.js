/* eslint-disable no-unused-vars */
import React from 'react';
import {
    View, StyleSheet, Text, Image
} from 'react-native';

const renderBox = (children, index = 0) => (
    <View style={[styles.box, { backgroundColor: index % 2 === 0 ? '#F7F7F7' : '#F7F7F7' }]}>
        {children}
    </View>
);

const styles = StyleSheet.create({
    box: {
        height: 45,
        borderWidth: 0.5,
        borderColor: '#b0006d',
        paddingHorizontal: 15,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    columnStyle: {
        width: '48%',
        marginBottom: 15,
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 10,
    },
    flexRow: {
        flexDirection: 'row',
    },
    viewItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 100,
    },
    img: {
        marginLeft: 2.5,
        marginRight: 2.5,
        alignSelf: 'center',
        height: 35,
        width: 35,
        resizeMode: 'contain',
    },
});

const LoadBox = ({ setTitle, iconPack, setTintColor }) => {
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

    return (
        <View style={styles.columnStyle}>
            <Text style={styles.text}>{setTitle}</Text>
            <View style={styles.flexRow}>
                {['Name', 'Icon'].map((item, index) => renderBox(<Text style={{ width: index === 0 ? 250 : 40, textAlign: 'center', fontWeight: 'bold' }}>{item}</Text>, 1))}
            </View>
            {empty()}
            {push(iconPack)}
            {data.map((item, index) => (
                <View key={index.toString()} style={[styles.viewItemRow]}>
                    {renderBox(<Text style={{ width: 250 }}>{Object.keys(item)}</Text>, index)}
                    {renderBox(<Image
                        source={item[Object.keys(item)]}
                        style={[styles.img, { tintColor: setTintColor }]}
                    />, index)}
                </View>
            ))}
        </View>
    );
};

export default LoadBox;
