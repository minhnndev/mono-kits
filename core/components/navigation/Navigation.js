/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import {
    createStackNavigator,
    TransitionPresets,
} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Animated, NativeModules, Platform, StyleSheet } from 'react-native';
import StackScreen from './screen/StackScreen';
import ModalScreen from './screen/ModalScreen';
import DialogScreen from './screen/DialogScreen';

const isAndroid = Platform.OS === 'android';

const Stack = createStackNavigator();
const Modal = createStackNavigator();
const background =
    'https://img.mservice.com.vn/app/img/02-navigation-10-sample-02-navigate-bg-01-pink-bg@3x.png';
const forAnimationHeader = ({ current, next }) => {
    const progress = Animated.add(
        current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: 'clamp',
        }),
        next
            ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                  extrapolate: 'clamp',
              })
            : 0,
    );

    const opacity = progress.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, 1, 0],
        extrapolate: 'clamp',
    });

    return {
        leftButtonStyle: { opacity },
        rightButtonStyle: { opacity },
        titleStyle: { opacity },
        backgroundStyle: { opacity },
    };
};

const config = {
    animation: 'timing',
    config: {
        duration: 0,
    },
};

const StackNavigator = ({ route }) => {
    const { params } = route;
    const isLowPerformance =
        NativeModules?.RNDeviceInfo?.devicePerformance === 'low-end';
    const options =
        isLowPerformance && isAndroid
            ? {
                  transitionSpec: {
                      open: config,
                      close: config,
                  },
              }
            : TransitionPresets.SlideFromRightIOS;
    return (
        <Stack.Navigator
            screenOptions={{
                ...params.defaultOption,
                options,
                headerStyleInterpolator: forAnimationHeader,
                gestureEnabled: true,
                gestureDirection: 'horizontal',
            }}>
            <Stack.Screen
                name="StackScreen"
                component={StackScreen}
                initialParams={params}
            />
        </Stack.Navigator>
    );
};
const Navigation = (props, ref) => {
    const navigatorRef = useRef(null);
    const isLowPerformance =
        NativeModules?.RNDeviceInfo?.devicePerformance === 'low-end';
    const options =
        isLowPerformance && isAndroid
            ? {
                  transitionSpec: {
                      open: config,
                      close: config,
                  },
              }
            : TransitionPresets.ModalSlideFromBottomIOS;
    useImperativeHandle(ref, () => navigatorRef.current);

    return (
        <NavigationContainer ref={navigatorRef} independent>
            <Modal.Navigator initialRouteName="Stack" headerMode="screen">
                <Modal.Screen
                    name="Stack"
                    component={StackNavigator}
                    initialParams={props}
                    options={{
                        headerShown: false,
                        cardStyle: { backgroundColor: 'transparent' },
                    }}
                />
                <Modal.Screen
                    name="Modal"
                    component={ModalScreen}
                    initialParams={props}
                    options={{
                        ...options,
                        cardStyle: { backgroundColor: 'transparent' },
                        gestureEnabled: false,
                    }}
                />
                <Modal.Screen
                    name="Dialog"
                    component={DialogScreen}
                    initialParams={props}
                    options={{
                        ...options,
                        headerShown: false,
                        gestureEnabled: false,
                        cardStyle: { backgroundColor: 'transparent' },
                    }}
                />
            </Modal.Navigator>
        </NavigationContainer>
    );
};

export default forwardRef(Navigation);
