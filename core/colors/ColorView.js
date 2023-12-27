import React from 'react';
import {View, Text, FlatList, TouchableOpacity, Clipboard} from 'react-native';

import color from './index';

export default class ColorView extends React.Component {
  renderColor = ({item}) => (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginVertical: 10,
      }}>
      <View
        style={{
          width: 80,
          height: 80,
          backgroundColor: color[item],
          borderRadius: 12,
          shadowColor: color.black_17,
          shadowOffset: {
            width: 2,
            height: 2,
          },
          shadowOpacity: 0.07,
          shadowRadius: 10,
        }}
      />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            Clipboard.setString(color[item]);
            alert(
              `This color (${color[item]}) has been copied to the clipboard `,
            );
          }}>
          <Text style={{marginVertical: 5}}>{color[item]}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Clipboard.setString(item);
            alert(`This color (${item}) has been copied to the clipboard `);
          }}>
          <Text>{item}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  render() {
    return (
      <FlatList
        contentContainerStyle={{justifyContent: 'space-between'}}
        numColumns={4}
        keyExtractor={(i, ii) => ii.toString()}
        data={Object.keys(color)}
        renderItem={this.renderColor}
      />
    );
  }
}
