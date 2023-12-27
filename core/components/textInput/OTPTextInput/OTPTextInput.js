import React, {Component, useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {RFValueHorizontal as ScaleSize} from '../../typography/reponsiveSize';
import Colors from '../../../colors';
import Text from '../../typography';

const {width} = Dimensions.get('window');

const LAYOUT_56 = 56;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  display: {
    height: ScaleSize(40),
    width: ScaleSize(40),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    borderColor: Colors.black_04,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  inputContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    height: LAYOUT_56,
    width: width,
    backgroundColor: Colors.transparent,
    fontSize: ScaleSize(24),
    fontWeight: '600',
    color: Colors.transparent,
    marginHorizontal: 4,
  },
  textInput: {
    fontSize: ScaleSize(15),
    fontWeight: 'bold',
    color: Colors.black_17,
    lineHeight: 22,
  },
  textInputSelection: {
    color: Colors.pink_05,
  },
});

const DEFAULT_CARET_INTERVAL = 500;
const CustomCaretOTP = ({index, textInputStyle}) => {
  const [showCaret, setShowCaret] = useState(true);

  useEffect(() => {
    const caretTimer = setInterval(() => {
      updateCaret();
    }, DEFAULT_CARET_INTERVAL);

    return () => {
      clearInterval(caretTimer);
    };
  }, [showCaret]);

  const updateCaret = () => {
    setShowCaret(!showCaret);
  };

  return (
    <Text
      key={`otp_${index}`}
      style={[styles.textInput, styles.textInputSelection, textInputStyle]}>
      {showCaret ? '|' : '-'}
    </Text>
  );
};

export default class OTPTextInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      otpText: props?.value || '',
      focused: false,
    };

    this.otpRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value) {
      this.onUpdate(this.props?.value);
    }
  }

  onUpdate = value => {
    this.setState({otpText: value});
  };

  focus = () => {
    this.setState({focused: true}, () => {
      this.otpRef?.current?.focus();
    });
  };

  blur = () => {
    this.onInputBlur();
  };

  onChangeText = text => {
    const {handleTextChange} = this.props;

    if (isNaN(text)) {
      return;
    }

    handleTextChange && handleTextChange(text);
  };

  onInputFocus = () => {
    const {onFocus, errorMessage, inputCount} = this.props;
    const {otpText} = this.state;
    if (!!errorMessage || otpText?.length === inputCount) {
      this.clear();
      return;
    }
    this.setState({focused: true}, () => {
      // this.otpRef?.current?.focus();
      onFocus && onFocus();
    });
  };

  onInputBlur = () => {
    const {onBlur} = this.props;
    this.setState({focused: false}, () => {
      // this.otpRef?.current?.blur();
      onBlur && onBlur();
    });
  };

  clear = () => {
    const {handleTextChange} = this.props;
    this.setState({otpText: '', focused: false}, () => {
      this.focus();
      handleTextChange && handleTextChange('');
    });
  };

  setValue = value => {
    this.onChangeText(value);
  };

  renderTextInputs = () => {
    const {
      inputCount,
      offTintColor,
      tintColor,
      containerInputStyle,
      textInputStyle,
      errorMessage,
    } = this.props;

    const {otpText, focused} = this.state;
    const TextInputs = [];

    for (let i = 0; i < inputCount; i++) {
      const displayStyle = [
        styles.display,
        containerInputStyle,
        {borderColor: offTintColor},
      ];

      const currentIndex = otpText?.length;
      if (focused && currentIndex === i && currentIndex < inputCount) {
        displayStyle.push({borderColor: tintColor});
      }

      if (!!errorMessage) {
        displayStyle.push({borderColor: Colors.red_05});
      }

      TextInputs.push(
        <View style={displayStyle} key={`display_${i}`}>
          {focused && otpText?.length === i ? (
            <CustomCaretOTP index={i} textInputStyle={textInputStyle} />
          ) : (
            <Text key={`otp_${i}`} style={[styles.textInput, textInputStyle]}>
              {otpText[i] || '-'}
            </Text>
          )}
        </View>,
      );
    }

    return TextInputs;
  };

  render() {
    const {
      inputCount,
      containerStyle,
      keyboardType,
      // autoFocus,
      textContentType,
      errorMessage,
    } = this.props;

    const {otpText} = this.state;

    // const selectedIndex = otpText?.length < inputCount ? otpText?.length : inputCount - 1;
    const selectedIndex = otpText?.length;
    const calcLeftPos = selectedIndex * (42 + 4 * 2);
    // const hideCaret = otpText?.length === inputCount;
    const hideCaret = true;

    return (
      <TouchableOpacity
        onPress={this.onInputFocus}
        activeOpacity={1}
        style={[styles.container, containerStyle]}
        accessible={false}>
        <View style={styles.otpContainer}>
          {this.renderTextInputs()}
          <TextInput
            testID={'OTPTextInput'}
            accessibilityLabel={'OTPTextInput'}
            ref={this.otpRef}
            key={'key_OTP'}
            autoCorrect={false}
            keyboardType={keyboardType}
            textContentType={textContentType}
            style={[styles.inputContainer, {left: calcLeftPos}]}
            maxLength={inputCount}
            onFocus={() => {
              this.onInputFocus();
            }}
            onBlur={() => {
              this.onInputBlur();
            }}
            value={otpText}
            onChangeText={this.onChangeText}
            multiline={false}
            caretHidden={hideCaret}
            underlineColorAndroid="transparent"
            // autoFocus={autoFocus}
          />
        </View>
        {/* <ErrorMessage
                    style={{ marginTop: 4 }}
                    errorMessage={errorMessage}
                    textStyle={{
                        color: Colors.red_05,
                        fontSize: ScaleSize(12),
                    }}
                /> */}
      </TouchableOpacity>
    );
  }
}

OTPTextInput.propTypes = {
  value: PropTypes.string,
  inputCount: PropTypes.number,
  containerStyle: PropTypes.any,
  containerInputStyle: PropTypes.any,
  textInputStyle: PropTypes.any,
  tintColor: PropTypes.string,
  offTintColor: PropTypes.string,
  handleTextChange: PropTypes.func,
  inputType: PropTypes.string,
  keyboardType: PropTypes.string,
  textContentType: PropTypes.string,
};

OTPTextInput.defaultProps = {
  value: '',
  inputCount: 6,
  tintColor: Colors.pink_05,
  offTintColor: Colors.black_04,
  containerStyle: {},
  containerInputStyle: {},
  textInputStyle: {},
  handleTextChange: () => {},
  keyboardType: 'number-pad',
  textContentType: 'oneTimeCode',
};
