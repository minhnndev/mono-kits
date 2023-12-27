import React from 'react';
import colors from '../../../colors';
import icons from '../../icon/cached_images.json';
import {
  NavigationAnimatedHeader,
  NavigationBackButton,
  NavigationBar,
  NavigationSearchBar,
  NavigationTitle,
} from '../components';

const {headerAnimatedPosition, headerAnimatedTitle, headerAnimatedBackground} =
  NavigationAnimatedHeader;

const customTitle = props => ({
  ...{headerTitleContainerStyle: {left: 60}},
  headerTitle: () => <NavigationTitle {...props} />,
});

const searchHeader = props => {
  const defaultThemes = {
    headerRight: () => <NavigationSearchBar {...props} />,
  };
  if (!props.isShowLeft) {
    defaultThemes.headerLeft = null;
  }
  return defaultThemes;
};

const isWhiteColor = color => {
  return color === 'white' || color === '#fff' || color === '#ffffff';
};

const headerLeft = (props = {}, tintColor = colors.white) => {
  const {params} = props?.route;
  const options = params?.options ?? params?.defaultOptions;
  const isWhite = isWhiteColor(options?.headerStyle?.backgroundColor);
  let backStyle = {};

  if (isWhite) {
    backStyle = {
      borderColor: colors.opacity_01_black_2,
      borderWidth: 0.5,
      backgroundColor: colors.opacity_02_white_25,
    };
    tintColor = colors.black_20;
  }

  return {
    headerLeft: headerProps => (
      <NavigationBackButton
        {...{
          ...props,
          ...headerProps,
          style: backStyle,
          icon: icons.ic_back.uri,
          iconStyle: {
            width: 20,
            height: 20,
          },
          tintColor,
        }}
      />
    ),
  };
};

const stackHeader = props => {
  const {params} = props?.route;
  const options = params?.options ?? params?.defaultOptions;
  const isWhite = isWhiteColor(options?.headerStyle?.backgroundColor);
  return {
    ...headerLeft(props),
    title: '',
    headerStyle: {
      backgroundColor: colors.primary,
      borderBottomWidth: 0,
    },
    headerTintColor: isWhite ? colors.black_20 : colors.white,
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontWeight: '600',
    },
    headerBackground: headerProps => <NavigationBar {...headerProps} />,
    ...props.route.params.defaultOptions,
  };
};
const modalHeader = props => ({
  ...headerLeft(props, colors.black),
  title: '',
  headerStyle: {
    backgroundColor: colors.white,
    borderBottomWidth: 0,
  },
  headerTintColor: colors.black,
  headerTitleAlign: 'center',
  headerTitleStyle: {
    color: colors.black,
    fontWeight: '600',
  },
  headerBackground: headerProps => <NavigationBar {...headerProps} />,
  ...props.route.params.defaultOptions,
});

const animatedHeader = props => {
  let customOptions = {};
  if (props.customTitle) {
    customOptions = customTitle(props);
  }
  if (props.headerTitle != null) {
    customOptions = {headerTitle: props.headerTitle, ...customOptions};
  }
  return {
    ...{
      headerTransparent: true,
      headerTitleAlign: props.headerTitleAlign,
      headerRight: () => headerAnimatedPosition('right', props),
      headerLeft: () => headerAnimatedPosition('left', props),
      headerBackground: () => headerAnimatedBackground(props),
      headerTitle: () => headerAnimatedTitle(props),
    },
    ...customOptions,
  };
};

module.exports = {
  animatedHeader,
  modalHeader,
  stackHeader,
  headerLeft,
  searchHeader,
  customTitle,
};
