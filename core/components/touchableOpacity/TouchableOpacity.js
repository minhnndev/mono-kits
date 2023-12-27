/* eslint-disable react/destructuring-assignment */
import React from 'react';
import {
    TouchableOpacity as Touch,
    TouchableNativeFeedback as TouchAndroid,
    Platform,
    View,
} from 'react-native';
import { throttle } from 'lodash';

const hitSlop = {
    top: 5,
    left: 5,
    right: 5,
    bottom: 5,
};

const TIME_SIGNLE_PRESS = 30000;
const TIME_OUT_PRESS = 1000;
export default class TouchableOpacity extends React.Component {
    constructor(props) {
        super(props);
        this.pressTimeout = null;
        this.pressOneTime = false;
        this.delay = props.delay || TIME_OUT_PRESS;
    }

    onPress = throttle(
        () => {
            const { onPress, signlePress } = this.props;
            if (signlePress) {
                if (this.pressOneTime) return;
                this.pressOneTime = true;
                setTimeout(() => {
                    this.pressOneTime = false;
                }, TIME_SIGNLE_PRESS);
                onPress?.();
            } else onPress?.();
        },
        this.props.delay || 200,
        { leading: true, trailing: false },
    );

    render() {
        return Platform.OS === 'android' ? (
            <TouchAndroid
                hitSlop={hitSlop}
                activeOpacity={0.5}
                onPress={this.onPress}
                {...this.props}
                style={{}}>
                <View style={this.props.style ?? {}}>
                    {this.props?.children}
                </View>
            </TouchAndroid>
        ) : (
            <Touch
                hitSlop={hitSlop}
                activeOpacity={0.5}
                {...this.props}
                onPress={this.onPress}>
                {this.props?.children}
            </Touch>
        );
    }
}
