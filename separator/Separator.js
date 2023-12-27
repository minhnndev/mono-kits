import React, { Component } from 'react';
import {
    View
} from 'react-native';
import PropTypes from 'prop-types';
import { Colors } from '@momo-kits/core';
import Dash from './Dash';

export default class Separator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layoutLength: 0
        };
        this.lengthPercent = 100;
    }

    onContainerlayout = ({ nativeEvent }) => {
        const { direction } = this.props;
        if (direction === 'vertical') {
            this.setState({
                layoutLength: nativeEvent.layout.height * this.lengthPercent / 100
            });
        } else {
            this.setState({
                layoutLength: nativeEvent.layout.width * this.lengthPercent / 100
            });
        }
    };

    renderLine = (type, lineStyle) => {
        const { dashLength, dashGap, direction } = this.props;
        switch (type) {
        case 'dash':
            return (
                <Dash
                    style={lineStyle}
                    direction={direction}
                    dashLength={dashLength}
                    dashGap={dashGap}
                />
            );
        default:
            return (
                <View style={lineStyle} />
            );
        }
    }

    render() {
        const {
            style,
            length,
            thickness,
            color,
            type,
            direction
        } = this.props;
        const { layoutLength } = this.state;
        const mapStyleFromType = () => {
            let lineStyle = {};
            let lineThickness = 1;
            let lineLength;
            const regex = new RegExp('[0-9]%');
            if (typeof thickness === 'number' || regex.test(thickness)) {
                lineThickness = thickness;
            } else if (!regex.test(thickness)) {
                console.warn('Invalid prop \'thickness\' supplied to \'Line\'');
            }
            lineLength = layoutLength;
            if (typeof length === 'number') {
                lineLength = length;
            } else if (regex.test(length)) {
                this.lengthPercent = length.replace('%', '');
            } else {
                console.warn('Invalid prop \'length\' supplied to \'Line\'');
            }

            switch (direction) {
            case 'vertical':
                lineStyle = { width: lineThickness, height: lineLength, backgroundColor: color };
                break;
            default:
                lineStyle = { width: lineLength, height: lineThickness, backgroundColor: color };
            }
            return lineStyle;
        };
        const lineStyle = mapStyleFromType();
        return (
            <View style={style} onLayout={this.onContainerlayout}>
                { this.renderLine(type, lineStyle) }
            </View>
        );
    }
}

Separator.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    length: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    thickness: PropTypes.number,
    color: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    type: PropTypes.oneOf(['solid', 'dash']),
    dashLength: PropTypes.number,
    dashGap: PropTypes.number,
    direction: PropTypes.oneOf(['horizontal', 'vertical'])
};

Separator.defaultProps = {
    dashGap: 2,
    dashLength: 4,
    thickness: 1,
    length: '100%',
    direction: 'horizontal',
    type: 'solid',
    color: Colors.very_light_pink_two
};
