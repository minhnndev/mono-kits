/* eslint-disable react/display-name */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import getStyles from './getStyles';
import Colors from '../../colors';

const styles = StyleSheet.create({
    text: {
        flexShrink: 1,
        color: Colors.light_black,
    },
});

const H1 = ({ ...props }) => <Text variant="h1" {...props} />;
const H2 = ({ ...props }) => <Text variant="h2" {...props} />;
const H3 = ({ ...props }) => <Text variant="h3" {...props} />;
const H4 = ({ ...props }) => <Text variant="h4" {...props} />;
const Title = ({ ...props }) => <Text variant="title" {...props} />;
const SubTitle = ({ ...props }) => <Text variant="subTitle" {...props} />;
const Caption = ({ ...props }) => <Text variant="caption" {...props} />;
const SmallPrint = ({ ...props }) => <Text variant="smallPrint" {...props} />;

// will remove in next versions
const Body = ({ ...props }) => <Text variant="body" {...props} />;
const Paragraph = ({ ...props }) => <Text variant="paragraph" {...props} />;

export default class Text extends React.PureComponent {
    static H1 = H1;

    static H2 = H2;

    static H3 = H3;

    static H4 = H4;

    static Title = Title;

    static SubTitle = SubTitle;

    static Caption = Caption;

    static SmallPrint = SmallPrint;

    // will remove in next versions
    static Body = Body;

    static Paragraph = Paragraph;

    render = () => {
        const { children, variant, color, font, weight, style, ...props } =
            this.props;
        const getStyle = getStyles({ font });
        return (
            <RNText
                accessibilityLabel={`${children ?? ''}/Text`}
                allowFontScaling={false}
                style={StyleSheet.flatten([
                    styles.text,
                    { color },
                    getStyle.weight[weight],
                    getStyle.type[variant],
                    font.name && getStyle.fontFamily[font.type],
                    style,
                ])}
                {...props}>
                {children ?? ''}
            </RNText>
        );
    };
}

Text.defaultProps = {
    font: { name: null, type: 'regular' },
    variant: 'title',
    weight: 'regular',
    color: Colors.light_black,
};

Text.propTypes = {
    font: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.oneOf([
            'black',
            'regular',
            'bold',
            'semibold',
            'heavy',
            'light',
            'thin',
            'ultralight',
        ]),
    }),
    variant: PropTypes.oneOf([
        'h1',
        'h2',
        'h3',
        'h4',
        'title',
        'subTitle',
        'caption',
        'smallPrint',
    ]),
    weight: PropTypes.oneOf(['bold', 'medium', 'regular', 'normal']),
    color: PropTypes.string,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
        PropTypes.array,
        PropTypes.any,
    ]),
};
