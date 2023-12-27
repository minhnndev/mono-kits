import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import {Animated, Platform} from 'react-native';
import StackScreen from './screen/StackScreen';
import ModalScreen from './screen/ModalScreen';
import DialogScreen from './screen/DialogScreen';

const Modal = createStackNavigator();
const transitionPresets = Platform.select({
  android: TransitionPresets.FadeFromBottomAndroid,
  default: {},
});

const forAnimationHeader = ({current, next}) => {
  let animation = 0;
  if (next) {
    animation = next.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
  }
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
    animation,
  );

  const opacity = progress.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  return {
    leftButtonStyle: {opacity},
    rightButtonStyle: {opacity},
    titleStyle: {opacity},
    backgroundStyle: {opacity},
  };
};

const Navigation = (props, ref) => {
  const {defaultOption = {}} = props;
  const navigatorRef = useRef(null);

  useImperativeHandle(ref, () => navigatorRef.current);

  return (
    <NavigationContainer ref={navigatorRef} independent>
      <Modal.Navigator initialRouteName="StackScreen" headerMode="screen">
        <Modal.Screen
          name="StackScreen"
          component={StackScreen}
          initialParams={props}
          options={{
            ...defaultOption,
            ...transitionPresets,
            headerStyleInterpolator: forAnimationHeader,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        />
        <Modal.Screen
          name="Modal"
          component={ModalScreen}
          initialParams={props}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
            cardStyle: {backgroundColor: 'transparent'},
            gestureEnabled: false,
          }}
        />
        <Modal.Screen
          name="Dialog"
          component={DialogScreen}
          initialParams={props}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS,
            headerShown: false,
            gestureEnabled: false,
            cardStyle: {backgroundColor: 'transparent'},
          }}
        />
      </Modal.Navigator>
    </NavigationContainer>
  );
};

export default forwardRef(Navigation);
