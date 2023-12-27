import React, { useRef, useState } from 'react';
import {
    Dimensions,
    PixelRatio,
    Platform,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import FaceDetectView from './FaceDetectView';
import SvgCircle from './SvgCircle';
import { Colors } from '@momo-kits/core';
import { isArray } from 'lodash';

const width = Dimensions.get('window').width;
const color = Colors.pink_01_alpha;
const DONE = 'DONE';
const STEPS_STATUS = {
    START_TIMER: 'startTimer',
    STOP_TIMER: 'stopTimer',
    UPDATED: 'updated',
};

// Tag params for Face Detect
/**
 * @param {String} faceNotContainWarning - Warning text when face out of range.
 * @param {String} bottomInstruction - Bottom text instruction.
 * @param {Function} onChange - Callback for every step update.
 * @param {Array} faceSteps - Steps data for face detect.
 */

export default function FaceDetect({
    faceSteps,
    faceNotContainWarning,
    multiFaceWarning,
    onChange: _onChange,
    bottomInstruction,
    isEyeBlink,
    onDidAnimate,
}) {
    const tasks = faceSteps.map?.((item) => item.stepName) ?? [];
    const r = width / 2 - 20;
    const [currentStep, setCurrentStep] = useState(tasks[0]);
    const [isFrameContain, setIsFrameContain] = useState(false);
    const [isMultiFace, setIsMultiFace] = useState(false);
    const [isNoFace, setIsNoFace] = useState(false);
    const faceDetectRef = useRef();
    const layoutRef = useRef();
    const isReadyRef = useRef(Platform.OS === 'ios');
    const circleRef = useRef();
    const isEyeBlinked = useRef(false);

    // Check valid data
    if (!isArray(faceSteps)) return null;
    if (
        faceSteps.some(
            (step) =>
                !step.stepName ||
                !isArray(step.x) ||
                step?.x?.length !== 2 ||
                !isArray(step.y) ||
                step?.y?.length !== 2 ||
                !isArray(step.z) ||
                step?.z?.length !== 2,
        )
    ) {
        return null;
    }

    const onReady = () => {
        isReadyRef.current = true;
        startTask();
    };

    const onLayout = ({ nativeEvent: { layout } }) => {
        if (currentStep === DONE) return;
        const { x, y, width, height } = layout;
        const cx = x + width / 2;
        const cy = y + height / 2;
        if (Platform.OS === 'android') {
            layoutRef.current = {
                top: PixelRatio.getPixelSizeForLayoutSize(cy - r),
                left: PixelRatio.getPixelSizeForLayoutSize(cx - r),
                bottom: PixelRatio.getPixelSizeForLayoutSize(cy + r),
                right: PixelRatio.getPixelSizeForLayoutSize(cx + r),
            };
        } else {
            layoutRef.current = {
                top: cy - r,
                left: cx - r,
                bottom: cy + r,
                right: cx + r,
            };
        }
        startTask();
    };

    const startTask = () => {
        if (layoutRef.current && isReadyRef.current) {
            faceDetectRef.current?.start({
                tasks: faceSteps,
                frame: layoutRef.current,
            });
        }
    };

    const shouldReset = () => {
        if (isEyeBlink) {
            return !isEyeBlinked.current || currentStep !== DONE;
        } else {
            return currentStep !== DONE;
        }
    };

    const onChangeFaceStatus = ({ nativeEvent }) => {
        const {
            isFrameContain: _isFrameContain,
            isMultiFace: _isMultiFace,
            isNoFace: _isNoFace,
            isOutFrame: _isOutFrame,
        } = nativeEvent;

        setIsFrameContain(_isFrameContain);
        setIsMultiFace(_isMultiFace);
        setIsNoFace(_isNoFace);
        const willReset = shouldReset();
        if (willReset && (_isOutFrame || _isNoFace || _isMultiFace)) {
            onResetFaceStep();
        }
    };

    const onResetFaceStep = () => {
        startTask();
        setCurrentStep(tasks[0]);
        circleRef.current.progressTo(0, 300);
        _onChange?.(null);
        isEyeBlinked.current = false;
    };

    const onStepUpdate = ({ nativeEvent }) => {
        const { status, stepName, isEyeBlinked: _isEyeBlinked } = nativeEvent;
        if (_isEyeBlinked) {
            isEyeBlinked.current = _isEyeBlinked;
        }
        _onChange?.(nativeEvent);
        if (!stepName) {
            return;
        }
        switch (status) {
            case STEPS_STATUS.START_TIMER: {
                const index = tasks.indexOf(stepName);
                circleRef.current.progressTo((index + 1) / tasks.length, 1500);
                break;
            }
            case STEPS_STATUS.STOP_TIMER: {
                const index = tasks.indexOf(stepName);
                circleRef.current.progressTo(index / tasks.length);
                break;
            }
            case STEPS_STATUS.UPDATED: {
                const index = tasks.indexOf(stepName);
                const nextStep = faceSteps[index + 1];
                if (nextStep) {
                    setCurrentStep(nextStep.stepName);
                } else {
                    setCurrentStep(DONE);
                }
            }
        }
    };

    let progressPercentage, instructionImage;
    switch (currentStep) {
        case DONE:
            progressPercentage = 1;
            break;
        case null:
            progressPercentage = 0;
            break;
        default:
            progressPercentage = tasks.indexOf(currentStep) / tasks.length;
            break;
    }
    instructionImage = faceSteps?.find(
        (s) => s.stepName === currentStep,
    )?.instructionImage;

    const renderLabelContent = () => {
        let label;
        if (currentStep === DONE) {
            label = '';
        } else if (isMultiFace) {
            label = multiFaceWarning;
        } else if (!isFrameContain || isNoFace) {
            label = faceNotContainWarning;
        } else {
            const currentTaskObj = faceSteps.find(
                (item) => item.stepName === currentStep,
            );
            label = currentTaskObj?.instruction ?? '--';
        }

        return (
            <View style={styles.instruction}>
                <Text style={styles.instructionText}>{label}</Text>
            </View>
        );
    };

    return (
        <View style={styles.flex}>
            <View style={styles.cameraContainer}>
                <View style={styles.cameraView}>
                    <FaceDetectView
                        ref={faceDetectRef}
                        style={styles.flex}
                        onReady={onReady}
                        onStepUpdate={onStepUpdate}
                        onChangeFaceStatus={onChangeFaceStatus}
                        angles={faceSteps}
                    />
                </View>
                <View style={styles.topSpace}>{renderLabelContent()}</View>
                <SvgCircle
                    ref={circleRef}
                    r={r}
                    color={color}
                    progress={progressPercentage}
                    onLayout={onLayout}
                    faceImageInstruction={instructionImage}
                    tintColor={Colors.back_fund_75}
                    progressColor={Colors.green_05}
                    trayColor={Colors.black_12}
                    onDidAnimate={onDidAnimate}
                />
                <View style={styles.bottomSpace} />
            </View>
            <View style={styles.textArea}>
                <View style={styles.textBox}>
                    <Text style={styles.bottomText}>{bottomInstruction}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    cameraContainer: {},
    cameraView: {
        ...StyleSheet.absoluteFill,
        overflow: 'hidden',
    },
    topSpace: {
        backgroundColor: color,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    bottomSpace: {
        backgroundColor: color,
        minHeight: 40,
    },
    textArea: {
        backgroundColor: color,
        paddingTop: 20,
        flex: 1,
    },
    textBox: {
        backgroundColor: Colors.back_fund_40,
        marginHorizontal: 20,
        borderRadius: 10,
        padding: 10,
    },
    bottomTextBold: {
        color: Colors.black_01,
        fontWeight: 'bold',
    },
    bottomText: {
        color: Colors.black_01,
        fontSize: 14,
        paddingVertical: 2,
        lineHeight: 20,
    },
    instruction: {
        backgroundColor: Colors.black_01,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginVertical: 16,
    },
    instructionText: {
        color: Colors.black_20,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
