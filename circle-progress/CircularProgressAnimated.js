import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    Animated, Easing
} from 'react-native';
import CircularProgress from './CircularProgress';

const CircularProgressAnimation = Animated.createAnimatedComponent(CircularProgress);

export default class CircularProgressAnimated extends Component {
    constructor(props) {
        super(props);
        this.fillValue = new Animated.Value(props.reverse ? props.fill : 0);
    }

    componentDidMount() {
        const {
            startAfterMilliseconds, fill, reverse, autoPlay
        } = this.props;
        if (autoPlay) {
            setTimeout(() => {
                this.startAnimation(reverse ? 0 : fill);
            }, startAfterMilliseconds);
        }
    }

    shouldComponentUpdate(nextProps) {
        const { fill, reverse } = this.props;
        if (fill !== nextProps.fill) {
            this.startAnimation(reverse ? 0 : nextProps.fill);
            return true;
        }
        return false;
    }

    startAnimation = (toValue) => {
        const {
            duration, animationEnd
        } = this.props;
        this.animating = true;
        Animated.timing(this.fillValue, {
            toValue,
            duration,
            easing: Easing.linear,
            useNativeDriver: false
        }).start(animationEnd);
    }

    stopAnimation = () => {
        this.animating = false;
        this.fillValue.stopAnimation((value) => {
            this.remainValue = value;
        });
    }

    continueAnimation = () => {
        if (this.animating) return;
        this.animating = true;
        const {
            fill, reverse, animationEnd, duration
        } = this.props;
        const fillValue = ((Math.abs((reverse ? fill : 0) - this.remainValue)) / fill);
        const remainDuration = duration - fillValue * duration;
        if (this.fillValue && fill && remainDuration) {
            this.fillValue.setValue(reverse ? this.remainValue : 0);
            Animated.timing(this.fillValue, {
                toValue: reverse ? 0 : fill,
                duration: remainDuration,
                easing: Easing.linear,
                useNativeDriver: false
            }).start(animationEnd);
        }
    }

    render() {
        return (
            <CircularProgressAnimation
                {...this.props}
                fill={this.fillValue}
            />
        );
    }
}

CircularProgressAnimated.propTypes = {
    animationEnd: PropTypes.func,
    duration: PropTypes.number,
    fill: PropTypes.number,
    startAfterMilliseconds: PropTypes.number,
    autoPlay: PropTypes.bool
};

CircularProgressAnimated.defaultProps = {
    duration: 500,
    startAfterMilliseconds: 500,
    autoPlay: true
};
