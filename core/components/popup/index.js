import React from 'react';

import ActionPopup from './action/ActionPopup';
import AlertPopup from './alert/AlertPopup';
import DisplayPopup from './display/DisplayPopup';
import KeyboardPopup from './keyboard/KeyboardPopup';
import LoadingPopup from './loading/LoadingPopup';
import PermissionPopup from './permission/PermissionPopup';
import BottomSheetPopup from './bottom/BottomSheet';

const Action = ({ ...restProps }) => <ActionPopup {...restProps} />;
const Alert = ({ ...restProps }) => <AlertPopup {...restProps} />;
const Display = ({ ...restProps }) => <DisplayPopup {...restProps} />;
const Keyboard = ({ ...restProps }) => <KeyboardPopup {...restProps} />;
const Loading = ({ ...restProps }) => <LoadingPopup {...restProps} />;
const Permission = ({ ...restProps }) => <PermissionPopup {...restProps} />;
const BottomSheet = ({ ...restProps }) => <BottomSheetPopup {...restProps} />;

export default {
    Action,
    Alert,
    Display,
    Keyboard,
    Loading,
    Permission,
    BottomSheet,
};
