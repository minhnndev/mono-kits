import React from 'react';
import {Pressable as RNPressable} from 'react-native';
const Pressable = props => {
  const {children, style} = props;
  const overlayColor = '#E0E1E4';
  return (
    <RNPressable
      android_ripple={{color: overlayColor}}
      style={({pressed}) => [
        {
          backgroundColor: pressed ? overlayColor : null,
        },
        style,
      ]}>
      {children}
    </RNPressable>
  );
};

export default Pressable;
