
export type SwipeDirection = 'up' | 'down' | 'left' | 'right'

export type DragEvent = {
  axis: {
    x: number;
    y: number;
  },
  layout: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  swipeDirection: string | null;
}

export type ModalProps = {
  visible: boolean;
  children: any;
  width?: number;
  height?: number;
  hasOverlay?: boolean;
  overlayPointerEvents?: 'auto' | 'none';
  overlayBackgroundColor?: string;
  overlayOpacity?: number;
  modalAnimation?: Object;
  modalStyle?: any;
  style?: any;
  animationDuration?: number;
  onTouchOutside?: () => void;
  onHardwareBackPress?: () => boolean;
  onShow?: () => void;
  onDismiss?: () => void;
  onMove?: (event: DragEvent) => void,
  onSwiping?: (event: DragEvent) => void,
  onSwipeRelease?: (event: DragEvent) => void,
  onSwipingOut?: (event: DragEvent) => void,
  onSwipeOut?: (event: DragEvent) => void,
  swipeDirection?: SwipeDirection | Array<SwipeDirection>;
  swipeThreshold?: number;
  useNativeDriver?: boolean;
}

export type ModalFooterActionList = Array<Element>;

export type modalFooterProps = {
  children: ModalFooterActionList;
  style?: any;
  bordered?: boolean;
}

export type ModalButtonProps = {
  text: string;
  onPress: () => void;
  align?: string;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
  activeOpacity?: number;
  bordered?: boolean;
}

export type ModalContentProps = {
  children: any,
  style?: any,
}

export type BackdropProps = {
  visible: boolean;
  opacity: number;
  onPress?: () => void;
  backgroundColor?: string;
  animationDuration?: number;
  pointerEvents?: string;
  useNativeDriver?: boolean;
}
