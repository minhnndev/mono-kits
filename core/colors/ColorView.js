import React from 'react';
import {
    View, Text, FlatList, TouchableOpacity, Clipboard
} from 'react-native';

import color from './index';

export default class ColorView extends React.Component {
    renderColor = ({ item }) => (
        <View style={{
            justifyContent: 'center', alignItems: 'center', flex: 1,  marginVertical: 10
        }}
        >
            <View style={{
                width: 70, height: 70, backgroundColor: color[item],
            }}
            />
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => {
                        Clipboard.setString(color[item]);
                        alert(`This color (${color[item]}) has been copied to the clipboard `);
                    }}
                >
                    <Text style={{ marginVertical: 5 }}>{color[item]}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        Clipboard.setString(item);
                        alert(`This color (${item}) has been copied to the clipboard `);
                    }}
                >
                    <Text>{item}</Text>

                </TouchableOpacity>

            </View>
        </View>
    )

    render() {
        return (
            <FlatList
                contentContainerStyle={{ justifyContent: 'space-between' }}
                numColumns={4}
                keyExtractor={(i, ii) => ii.toString()}
                data={Object.keys(color)}
                renderItem={this.renderColor}
            />

        );
    }
}
