/* eslint-disable react/display-name */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {Dimensions, Platform, StyleSheet, Text as RNText} from 'react-native';
import PropTypes from 'prop-types';
import {isEmpty} from 'lodash';
import getStyles from './getStyles';
import Colors from '../../colors';
import {RFValueHorizontal} from './reponsiveSize';

const styles = StyleSheet.create({
  text: {
    flexShrink: 1,
    color: Colors.light_black,
  },
});

const H1 = ({...props}) => <Text variant="h1" {...props} />;
const H2 = ({...props}) => <Text variant="h2" {...props} />;
const H3 = ({...props}) => <Text variant="h3" {...props} />;
const H4 = ({...props}) => <Text variant="h4" {...props} />;
const Title = ({...props}) => <Text variant="title" {...props} />;
const SubTitle = ({...props}) => <Text variant="subTitle" {...props} />;
const Caption = ({...props}) => <Text variant="caption" {...props} />;
const SmallPrint = ({...props}) => <Text variant="smallPrint" {...props} />;
// will remove in next versions
const Body = ({...props}) => <Text variant="body" {...props} />;
const Paragraph = ({...props}) => <Text variant="paragraph" {...props} />;

const sizes = {
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 16,
  title: 14,
  subTitle: 12,
  caption: 10,
  smallPrint: 8,
};
export default class Text extends React.PureComponent {
  state = {
    dimensions: {},
  };

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

  componentDidMount() {
    this.subscription = Dimensions.addEventListener('change', ({window}) => {
      if (
        window?.height > 0 &&
        window?.width > 0 &&
        Platform.OS === 'android'
      ) {
        this.setState({dimensions: window});
      }
    });
  }

  componentWillUnmount() {
    this.subscription?.remove?.();
  }

  render = () => {
    const {children, variant, color, font, weight, style, size, ...props} =
      this.props;
    const {dimensions} = this.state;
    const fontSize = RFValueHorizontal(
      size || sizes[variant],
      dimensions?.width > 0 ? dimensions?.width : null,
    );
    const getStyle = getStyles({font});
    const flattenStyle = StyleSheet.flatten(style);
    return (
      <RNText
        accessibilityLabel={`${children ?? ''}/Text`}
        allowFontScaling={false}
        style={StyleSheet.flatten([
          styles.text,
          {color},
          getStyle.weight[flattenStyle?.fontWeight || weight],
          getStyle.type[variant],
          font.name && getStyle.fontFamily[font.type],
          (!isEmpty(dimensions) || size) && {fontSize},
          style,
        ])}
        {...props}>
        {children ?? ''}
      </RNText>
    );
  };
}

Text.defaultProps = {
  font: {name: null, type: 'regular'},
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
  weight: PropTypes.oneOf(['bold', 'semibold', 'medium', 'regular', 'normal']),
  color: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.array,
    PropTypes.any,
  ]),
};
