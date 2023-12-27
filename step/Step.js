import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HorizontalStep from './Step.horizontal';
import VerticalStep from './Step.vertical';

import { Colors, IconSource } from '@momo-kits/core';
export default class Step extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { isVertical } = this.props;
        let DefaultComponent = HorizontalStep;
        if (isVertical) {
            DefaultComponent = VerticalStep;
        }
        return <DefaultComponent {...this.props} />;
    }
}

Step.propTypes = {
    titles: PropTypes.array,
    currentStep: PropTypes.number,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    items: PropTypes.array,
    isVertical: PropTypes.bool,
    iconActive: PropTypes.any,
    iconChecked: PropTypes.any,
    iconUnchecked: PropTypes.any,
    circleColorActive: PropTypes.string,
    circleColorChecked: PropTypes.string,
    circleColorUnchecked: PropTypes.string,
    circleBorderColorActive: PropTypes.string,
    circleBorderColorChecked: PropTypes.string,
    circleBorderColorUnchecked: PropTypes.string,
    lineColorActive: PropTypes.string,
    lineColorInActive: PropTypes.string,
    titleStyle: PropTypes.object,
    descriptionStyle: PropTypes.object,
    dateStyle: PropTypes.object,
};

Step.defaultProps = {
    titles: [],
    currentStep: 0,
    isVertical: false,
    circleColorActive: '#d82d8b',
    circleColorChecked: '#ffadd2',
    circleColorUnchecked: Colors.black_06,
    circleBorderColorActive: Colors.pink_09,
    circleBorderColorChecked: Colors.pink_09,
    circleBorderColorUnchecked: Colors.black_04,
    lineColorActive: '#ffd6e7',
    lineColorInActive: Colors.black_04,
};
