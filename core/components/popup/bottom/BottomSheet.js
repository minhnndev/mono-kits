import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import {ifIphoneX} from '../../../utils/ScreenUtils';
import Colors from '../../../colors';
import Text from '../../typography';
import Image from '../../image/FastImage';
import Spacing from '../../../spacing';
import Icon from '../../icon/Icon';
import Radius from '../../../radius';
import TouchableOpacity from '../../touchableOpacity/TouchableOpacity';
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: Radius.M,
    borderTopRightRadius: Radius.M,
    paddingVertical: Spacing.S,
    paddingBottom: ifIphoneX(48, 25),
    maxHeight: Dimensions.get('window').height * 0.66,
    minHeight: Dimensions.get('window').height * 0.33,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.L,
    marginBottom: Spacing.S,
    height: 48,
  },
  headerRow: {flexDirection: 'row', alignItems: 'center'},
  headerIcon: {
    height: 44,
    width: 44,
    resizeMode: 'contain',
    marginRight: Spacing.M,
  },
  headerClose: {height: 24, width: 24, tintColor: Colors.black_17},
  title: {
    color: '#222222',
    fontWeight: 'bold',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginHorizontal: Spacing.L,
    paddingTop: Spacing.S,
    marginBottom: Spacing.S,
  },
  iconText: {
    width: width / 4 - Spacing.L / 2,
    minHeight: 92,
    marginTop: Spacing.M,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainter: {
    width: width / 12 + 5,
    height: width / 12 + 5,
    backgroundColor: Colors.black_02,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.S,
  },
  title: {
    marginTop: Spacing.XS,
    minHeight: 35,
    maxWidth: width / 5 - Spacing.L / 3,
    textAlign: 'center',
  },
  image: {
    width: width / 12,
    height: width / 12,
  },
});

const Button = ({onPress, buttonType, buttonTitle, buttonStyle, icon}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {buttonType == 'button' ? (
        <Icon name={icon} style={styles.headerClose} />
      ) : (
        <Text.Title style={[buttonStyle]}>{buttonTitle}</Text.Title>
      )}
    </TouchableOpacity>
  );
};

const Header = ({
  title,
  subTitle,
  icon,
  onPressClose,
  onPressBack,
  buttonLeftType,
  buttonLeftTitle,
  buttonRightType,
  buttonRightTitle,
  buttonLeftTitleStyle,
  buttonRightTitleStyle,
}) => {
  return (
    <View style={styles.header}>
      {!icon && buttonLeftType !== 'none' && (
        <Button
          onPress={onPressBack}
          buttonType={buttonLeftType}
          buttonStyle={buttonLeftTitleStyle}
          buttonTitle={buttonLeftTitle}
          icon="arrow_chevron_left"
        />
      )}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {icon && buttonLeftType !== 'none' && (
          <Button
            onPress={onPressBack}
            buttonType={buttonLeftType}
            buttonStyle={buttonLeftTitleStyle}
            buttonTitle={buttonLeftTitle}
            icon="arrow_chevron_left"
          />
        )}
        <View style={styles.headerRow}>
          <Image source={icon} style={styles.headerIcon} />
          <View style={{justifyContent: 'center'}}>
            <Text.Title color={Colors.black_17} weight="bold">
              {title}
            </Text.Title>
            {subTitle && (
              <Text.SubTitle color={Colors.black_12}>{subTitle}</Text.SubTitle>
            )}
          </View>
        </View>
      </View>
      <Button
        onPress={onPressClose}
        buttonType={buttonRightType}
        buttonStyle={buttonRightTitleStyle}
        buttonTitle={buttonRightTitle}
        icon="24_navigation_close"
      />
    </View>
  );
};

const BottomSheet = ({
  title,
  subTitle,
  icon,
  onClosed,
  requestClose,
  style,
  buttonLeftType = 'button',
  buttonRightType = 'button',
  buttonLeftTitle,
  buttonRightTitle,
  onPressLeftButton,
  body,
}) => {
  const onPressClose = () => {
    onClosed?.();
    requestClose?.();
  };

  return (
    <View style={[styles.container, style]}>
      <Header
        title={title}
        subTitle={subTitle}
        icon={icon}
        onPressClose={onPressClose}
        onPressBack={onPressLeftButton}
        buttonLeftType={buttonLeftType}
        buttonRightType={buttonRightType}
        buttonLeftTitle={buttonLeftTitle}
        buttonRightTitle={buttonRightTitle}
      />
      <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: Colors.very_light_pink_two,
        }}
      />
      {body}
    </View>
  );
};

BottomSheet.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  icon: PropTypes.any,
  onClosed: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  buttonLeftType: PropTypes.oneOf(['button', 'word', 'none']),
  buttonLeftTitle: PropTypes.string,
  buttonRightType: PropTypes.oneOf(['button', 'word', 'none']),
  buttonRightTitle: PropTypes.string,
  buttonLeftTitleStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  buttonRightTitleStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  onPressLeftButton: PropTypes.func,
};

export default BottomSheet;
