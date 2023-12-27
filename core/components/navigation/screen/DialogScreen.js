/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-classes-per-file */
import React from 'react';
import { get } from 'lodash';
import Navigator from '../navigator/Navigator';
import Modal from '../../animationModal/Modal';
import BottomModal from '../../animationModal/BottomModal';
import GestureModal from '../../modalize';

const styleCenter = {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'
};

export default class DialogScreen extends React.Component {
    constructor(props) {
        super(props);
        const { navigation } = props;
        this.navigator = new Navigator(navigation);
        this.state = { visible: false };
        this.TIME_OUT = null;
        this.modalRef = React.createRef();
    }

    componentDidMount() {
        const { route } = this.props;
        const routeParams = route.params || {};
        const { params: { gestureModal = false }, } = routeParams;
        this.TIME_OUT = setTimeout(() => {
            if (gestureModal) {
                this.modalRef.current?.open();
            } else {
                this.setState({ visible: true });
            }
        }, 200);
        if(routeParams.options){
            this.navigator?.setOptions?.(routeParams.options);
        }
    }

    componentWillUnmount() {
        this.TIME_OUT && clearTimeout(this.TIME_OUT);
    }

    requestClose = (requestClose) => {
        this.onClose = requestClose;
        const { route } = this.props;
        const routeParams = route.params || {};
        const { params: { gestureModal = false }, } = routeParams;
        if (gestureModal) {
            this.modalRef.current?.close();
        } else {
            this.setState({ visible: false });
        }
    };

    onDismiss = () => {
        this.navigator.dismiss();
        const { route } = this.props;
        route?.params?.onClose?.();
        this.onClose && typeof this.onClose === 'function' && this.onClose();
        this.onClose = null;
    }

    onTouchOutside = () => {
        const closeOnTouchOutside = get(this.props, 'route.params.params.closeOnTouchOutside', true);
        const onClosePopup = get(this.props, 'route.params.params.onClosePopup', () => { });
        if (closeOnTouchOutside) {
            this.requestClose(onClosePopup);
        }
    }

    onHardwareBackPress = () => {
        const { route } = this.props;
        const routeParams = route.params || {};
        const { params: { onHardwareBackPress } } = routeParams;
        if (typeof onHardwareBackPress === 'function') {
            onHardwareBackPress();
        }
        this.requestClose();
    }

    render() {
        const { route } = this.props;
        const routeParams = route.params || {};
        const ScreenComp = routeParams.screen;
        const { params: { dragDisabled = true, gestureModal = false, gestureModalProps }, params } = routeParams;
        const { visible } = this.state;
        const isBottomModal = routeParams.position === 'bottom';
        const ModalComp = isBottomModal ? gestureModal ? GestureModal : BottomModal : Modal;

        return (
            <ModalComp
                {...gestureModalProps}
                isBottomModal={isBottomModal}
                ref={gestureModal ? this.modalRef : undefined}
                visible={visible}
                onDismiss={this.onDismiss}
                dragDisabled={dragDisabled}
                style={isBottomModal ? {} : styleCenter}
                onTouchOutside={this.onTouchOutside}
                onSwipeOut={this.requestClose}
                onOverlayPress={this.onTouchOutside}
                onClosed={this.onDismiss}
                onBackButtonPress={this.onHardwareBackPress}
                onHardwareBackPress={this.onHardwareBackPress}
                swipeDirection={['down']}
                adjustToContentHeight
                modalStyle={{ backgroundColor: 'transparent' }}
            >
                <ScreenComp
                    {...params}
                    navigator={this.navigator}
                    requestClose={this.requestClose}
                />
            </ModalComp>
        );
    }
}

DialogScreen.defaultProps = {
    closeOnTouchOutside: true
};
module.exports = DialogScreen;
