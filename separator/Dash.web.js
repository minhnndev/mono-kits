import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import Colors from '../../core/colors';

export default class MomoDash extends Component {
    getDashStyleId = () => {
        const {
            dashGap, dashLength, backgroundColor, direction
        } = this.props;
        return (
            `${dashGap}-${dashLength}-${backgroundColor}-${direction}`
        );
    }

    createDashStyleSheet = () => {
        const {
            dashGap, dashLength, style, direction
        } = this.props;
        const isRow = direction === 'horizontal';
        const idStyle = StyleSheet.create({
            style: {
                width: isRow ? dashLength : style.width,
                height: isRow ? style.height : dashLength,
                marginRight: isRow ? dashGap : 0,
                marginBottom: isRow ? 0 : dashGap,
                backgroundColor: style.backgroundColor
            },
        });
        return idStyle.style;
    };

    getDashStyle = () => {
        let stylesStore = {};
        const id = this.getDashStyleId();
        if (!stylesStore[id]) {
            stylesStore = {
                ...stylesStore,
                [id]: this.createDashStyleSheet(),
            };
        }
        return stylesStore[id];
    };

    render() {
        const {
            style, dashGap, dashLength, dashStyle, direction
        } = this.props;
        const isRow = direction === 'horizontal';
        const length = isRow ? style.width : style.height;
        const n = Math.ceil(length / (dashGap + dashLength));
        const calculatedDashStyles = this.getDashStyle();
        const dash = [];
        for (let i = 0; i < n; i++) {
            dash.push(
                <View
                    key={i}
                    style={[
                        calculatedDashStyles,
                        dashStyle,
                    ]}
                />
            );
        }
        return (
            <View
                style={[isRow ? styles.row : styles.column]}
            >
                { dash }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row' },
    column: { flexDirection: 'column' },
});

MomoDash.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    dashGap: PropTypes.number,
    dashLength: PropTypes.number,
    backgroundColor: PropTypes.string,
    dashStyle: PropTypes.object,
    direction: PropTypes.string
};

MomoDash.defaultProps = {
    dashGap: 2,
    dashLength: 4,
    backgroundColor: Colors.very_light_pink_two,
    direction: 'horizontal'
};
