import React, {useLayoutEffect} from 'react';
import {useSafeArea} from 'react-native-safe-area-context';
import {requestFunction} from '../../../utils/PlatformUtils';
import {hooks, utils} from '../assets';
import HeaderRight from '../components/AnimatedHeaderRight';
import StackNavigator from '../navigator/StackNavigator';
import Colors from '../../../colors';

const onUtilityToolActionType = {
  share: 'shareApp',
  addFavorite: 'addFavorite',
  addShortcut: 'addShortcut',
};

const ScreenStack = ({route, navigation, ...props}) => {
  const {params, navigator, ScreenComp} = hooks.useNavigator({
    StackClass: StackNavigator,
    route,
    navigation,
    ...props,
  });

  const isWhiteColor = color => {
    return color === 'white' || color === '#fff' || color === '#ffffff';
  };
  const renderRightHeader = (utilityToolConfig = {}, appCode) => {
    const {backgroundColor} = navigator?.defaultOptions?.headerStyle ?? {};
    let buttonStyle = {};
    let tintColor;
    if (isWhiteColor(backgroundColor)) {
      buttonStyle = {
        borderWidth: 0.5,
        borderColor: Colors.opacity_01_black_25,
        backgroundColor: 'transparent',
      };
      tintColor = Colors.black_17;
    }
    return (
      <HeaderRight
        buttonStyle={buttonStyle}
        tintColor={tintColor}
        onUtilityToolAction={() => {
          requestFunction(onUtilityToolActionType[utilityToolConfig?.type], [
            null,
          ]);
        }}
        utilityToolConfig={utilityToolConfig}
        onAction={() => requestFunction('showToolkit', [utilityToolConfig])}
        onClose={() => requestFunction('dismiss', [])}
        appCode={appCode}
      />
    );
  };

  useLayoutEffect(() => {
    requestFunction('getToolkit', [null], null, result => {
      if (result === true) {
        requestFunction('getToolkitConfig', [null], null, (config = {}) => {
          const {utilityToolConfig = {}, appCode} = config;
          const allConfig = {
            ...utilityToolConfig,
            onClose: params?.onCloseToolkit,
          };
          navigator?.setOptions?.({
            headerRight: () => renderRightHeader(allConfig, appCode),
          });
        });
      }
    });
  }, []);

  const insets = useSafeArea();
  const headerHeight = utils.getDefaultHeaderHeight() + insets.top;

  return (
    <ScreenComp
      params={params}
      navigator={navigator}
      headerHeight={headerHeight}
    />
  );
};

export default ScreenStack;
