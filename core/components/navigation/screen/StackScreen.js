import React, { useLayoutEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { hooks, utils } from '../assets';
import StackNavigator from '../navigator/StackNavigator';
import { requestFunction } from '../../../utils/PlatformUtils';
import HeaderRight from '../components/AnimatedHeaderRight';

const onUtilityToolActionType = {
    share: 'shareApp',
    addFavorite: 'addFavorite',
    addShortcut: 'addShortcut',
};

const ScreenStack = ({ route, navigation, ...props }) => {
    const { params, navigator, ScreenComp } = hooks.useNavigator({
        StackClass: StackNavigator,
        route,
        navigation,
        ...props,
    });

    useLayoutEffect(() => {
        requestFunction('getToolkit', [null], null, (result) => {
            if (result === true) {
                requestFunction(
                    'getToolkitConfig',
                    [null],
                    null,
                    (config = {}) => {
                        const { tooltipConfig = {}, utilityToolConfig = {} } =
                            config;

                        navigator?.setOptions?.({
                            headerRight: () => (
                                <HeaderRight
                                    onUtilityToolAction={(callback) => {
                                        requestFunction(
                                            onUtilityToolActionType[
                                                utilityToolConfig?.type
                                            ],
                                            [null],
                                            null,
                                            (data) => {
                                                callback(data);
                                            },
                                        );
                                    }}
                                    tooltipConfig={tooltipConfig}
                                    utilityToolConfig={utilityToolConfig}
                                    onAction={() =>
                                        requestFunction('showToolkit', [])
                                    }
                                    onClose={() =>
                                        requestFunction('dismiss', [])
                                    }
                                />
                            ),
                        });
                    },
                );
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
