import PropTypes from 'prop-types';
import React, { Component, } from 'react';
import {
    View, Switch, ScrollView, Platform, StyleSheet
} from 'react-native';
import moment from 'moment';
import { Text, SwitchLanguage } from '@momo-kits/core';
import CalendarPro from './CalendarPro';
import TabHeader from './TabHeader';

const DOUBLE = 'doubleDate';
// const SIGNLE = 'signleDate';
class Calendar extends Component {
    constructor(props) {
        super(props);
        this.doubleDate = props.doubleDate ? {
            first: props.doubleDate.first ? moment(props.doubleDate.first) : null,
            second: props.doubleDate.second ? moment(props.doubleDate.second) : null
        } : {};
        this.tabSelected = 0;
        this.selectedDate = props.selectedDate ? moment(props.selectedDate) : moment();

        this.state = {
            isDoubleDateMode: props.mode === DOUBLE
        };
        this.calendarPicker = React.createRef();
        this.cellHeader1 = React.createRef();
        this.cellHeader2 = React.createRef();
        this.cellHeaderSingle = React.createRef();
    }

    componentDidMount() {
        const { id } = this.props;
        this.tabSelected = id || 0;
        this.viewInit();
    }

    viewInit() {
        const { mode } = this.props;
        if (mode === DOUBLE) {
            if (this.cellHeader1.current && this.cellHeader2.current && this.calendarPicker.current) {
                const start = this.doubleDate.first ? this.doubleDate.first : null;
                const end = this.doubleDate.second ? this.doubleDate.second : null;
                this.cellHeader1.current.updateView(start, this.tabSelected === 0);
                this.cellHeader2.current.updateView(end, this.tabSelected === 1);
                this.calendarPicker.current.setDoubleDateAndTabIndex(this.doubleDate.first, this.doubleDate.second, this.tabSelected);
            }
        } else if (this.calendarPicker.current) {
            this.calendarPicker.current.setDoubleDateAndTabIndex(this.selectedDate);
        }
    }

    onChangeTab = (idTab) => {
        this.tabSelected = idTab;
        if (this.cellHeader1.current && this.cellHeader2.current) {
            this.cellHeader1.current.setActiveTab(idTab === 0);
            this.cellHeader2.current.setActiveTab(idTab === 1);
        }
        this.updateViewFlowPicker();
    };

    updateViewFlowPicker() {
        if (this.calendarPicker.current) {
            this.calendarPicker.current.setDoubleDateAndTabIndex(this.doubleDate.first, this.doubleDate.second, this.tabSelected);
        }
    }

    processDateFirst() {
        const { onDateChange, onCTAStateChange } = this.props;
        if (this.cellHeader1.current && this.cellHeader2.current && this.calendarPicker.current) {
            if (this.doubleDate.first && this.doubleDate.second && this.selectedDate <= this.doubleDate.second) {
                this.doubleDate.first = this.selectedDate;
                this.tabSelected = 1;
                this.cellHeader1.current.updateView(this.selectedDate, this.tabSelected === 0);
                this.cellHeader2.current.setActiveTab(this.tabSelected === 1);
                this.calendarPicker.current.setDoubleDateAndTabIndex(this.doubleDate.first, this.doubleDate.second, this.tabSelected);
                if (onDateChange) {
                    // const cloned = {
                    //     first: this.doubleDate.first ? this.doubleDate.first.toDate() : null,
                    // this.doubleDate.first ? new Date(this.doubleDate.first.year(), this.doubleDate.first.month(), this.doubleDate.first.date()) : null,
                    //     second: this.doubleDate.second ? this.doubleDate.second.toDate() : null
                    // this.doubleDate.second ? new Date(this.doubleDate.second.year(), this.doubleDate.second.month(), this.doubleDate.second.date()) : null
                    // };
                    onDateChange({
                        first: this.doubleDate.first ? this.doubleDate.first.toDate() : null,
                        second: this.doubleDate.second ? this.doubleDate.second.toDate() : null
                    });
                }
            } else {
                this.doubleDate.first = this.selectedDate;
                this.doubleDate.second = null;
                this.cellHeader1.current.updateView(this.selectedDate, false);
                this.cellHeader2.current.updateView(null, true);
                this.tabSelected = 1;
                this.calendarPicker.current.setDoubleDateAndTabIndex(this.doubleDate.first, this.doubleDate.second, this.tabSelected);
                if (onDateChange) {
                    onDateChange({
                        first: this.doubleDate.first ? this.doubleDate.first.toDate() : null,
                        second: this.doubleDate.second ? this.doubleDate.second.toDate() : null
                    });
                    // const cloned = {
                    //     first: this.doubleDate.first ? new Date(this.doubleDate.first.year(), this.doubleDate.first.month(), this.doubleDate.first.date()) : null,
                    //     second: this.doubleDate.second ? new Date(this.doubleDate.second.year(), this.doubleDate.second.month(), this.doubleDate.second.date()) : null
                    // };
                    // onDateChange(cloned);
                }
            }
        }
        if (onCTAStateChange) {
            onCTAStateChange(!!(this.doubleDate.second));
        }
    }

    processDateSecond() {
        const { onDateChange, onCTAStateChange } = this.props;
        if (this.cellHeader2.current) {
            this.cellHeader2.current.updateView(this.selectedDate, false);
            this.cellHeader1.current.setActiveTab(true);
            this.doubleDate.second = this.selectedDate;
            this.tabSelected = 0;
            this.calendarPicker.current.setDoubleDateAndTabIndex(this.doubleDate.first, this.doubleDate.second, this.tabSelected);
            if (onCTAStateChange) {
                onCTAStateChange(!!(this.doubleDate.second));
            }
            if (onDateChange) {
                onDateChange({
                    first: this.doubleDate.first ? this.doubleDate.first.toDate() : null,
                    second: this.doubleDate.second ? this.doubleDate.second.toDate() : null
                });
                // const cloned = {
                //     first: this.doubleDate.first ? new Date(this.doubleDate.first.year(), this.doubleDate.first.month(), this.doubleDate.first.date()) : null,
                //     second: this.doubleDate.second ? new Date(this.doubleDate.second.year(), this.doubleDate.second.month(), this.doubleDate.second.date()) : null
                // };
                // onDateChange(cloned);
            }
        }
    }

    processDoubleDate() {
        if (this.tabSelected === 0) {
            this.processDateFirst();
        } else {
            this.processDateSecond();
        }
    }

    updateView() {
        const { onDateChange } = this.props;
        const { isDoubleDateMode } = this.state;

        if (isDoubleDateMode) {
            this.processDoubleDate();
        } else {
            if (this.cellHeaderSingle.current) {
                this.cellHeaderSingle.current.updateView(this.selectedDate, true);
            }
            if (onDateChange) {
                const date = new Date(this.selectedDate.toDate());
                onDateChange(date);
            }
        }
    }

    onDateChange = (date) => {
        this.selectedDate = date;
        this.updateView();
    }

    updateHeaderView = () => {
        const { onDateChange, onCTAStateChange } = this.props;
        const { isDoubleDateMode } = this.state;
        if (isDoubleDateMode) {
            if (this.cellHeader1.current && this.cellHeader2.current) {
                this.cellHeader1.current.updateView(this.selectedDate, true);
                this.cellHeader2.current.updateView(null, false);
                this.calendarPicker.current.setDoubleDateAndTabIndex(this.selectedDate, null, this.tabSelected);
                this.doubleDate.first = moment(this.selectedDate);
                this.doubleDate.second = null;
                this.tabSelected = 0;

                if (onCTAStateChange) {
                    onCTAStateChange(false);
                }
                if (onDateChange) {
                    onDateChange({
                        first: this.doubleDate.first ? this.doubleDate.first.toDate() : null,
                        second: this.doubleDate.second ? this.doubleDate.second.toDate() : null
                    });
                    // const cloned = {
                    //     first: this.doubleDate.first ? new Date(this.doubleDate.first.year(), this.doubleDate.first.month(), this.doubleDate.first.date()) : null,
                    //     second: this.doubleDate.second ? new Date(this.doubleDate.second.year(), this.doubleDate.second.month(), this.doubleDate.second.date()) : null
                    // };
                    // onDateChange(cloned);
                }
            }
        } else {
            if (onCTAStateChange) {
                onCTAStateChange(true);
            }
            if (this.cellHeaderSingle.current) {
                if (this.doubleDate.first) {
                    this.cellHeaderSingle.current.updateView(this.doubleDate.first, true);
                    this.selectedDate = this.doubleDate.first;
                } else {
                    this.cellHeaderSingle.current.updateView(this.selectedDate, true);
                }

                if (onDateChange) {
                    // const clone = moment(this.selectedDate);
                    // const cloned = new Date(clone.year(), clone.month(), clone.date());
                    onDateChange(this.selectedDate.toDate());
                }
            }
        }
    };

    toggleSelectionDateMode = () => {
        const { onCallbackCalendar } = this.props;
        this.setState((preState) => ({ isDoubleDateMode: !preState.isDoubleDateMode }), () => {
            const { isDoubleDateMode } = this.state;
            this.updateHeaderView();
            if (onCallbackCalendar && typeof onCallbackCalendar === 'function') {
                onCallbackCalendar('switch', isDoubleDateMode);
            }
        });
    };

    renderSwitchReturnSelection = () => {
        const { isDoubleDateMode } = this.state;
        return (
            <View style={styles.viewSwitch}>
                <Text.Caption style={styles.textSwitch}>
                    {SwitchLanguage.chooseRoundtrip}
                </Text.Caption>
                <Switch
                    value={isDoubleDateMode}
                    onValueChange={this.toggleSelectionDateMode}
                    thumbColor={isDoubleDateMode ? '#78ca32' : 'white'}
                    trackColor={{ false: '#e5e7ec', true: '#e5e7ec' }}
                    style={[Platform.OS === 'ios' && { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }]}
                />
            </View>
        );
    };

    renderHeaderPanel = () => {
        const { isDoubleDateMode } = this.state;
        const { headerFrom, headerTo } = this.props;
        return (isDoubleDateMode ? (
            <View style={styles.viewPanel}>
                <TabHeader
                    id={0}
                    ref={this.cellHeader1}
                    onChangeTab={this.onChangeTab}
                    label={headerFrom || SwitchLanguage.depart}
                    activeTab
                    date={this.doubleDate.first}
                />

                <TabHeader
                    id={1}
                    ref={this.cellHeader2}
                    onChangeTab={this.onChangeTab}
                    label={headerTo || SwitchLanguage.return}
                    activeTab={false}
                    date=""
                />
            </View>
        ) : (
            <View style={styles.viewPanel_2}>
                <TabHeader
                    id={1}
                    disabled
                    ref={this.cellHeaderSingle}
                    label={headerFrom || SwitchLanguage.depart}
                    activeTab
                    date={this.selectedDate}
                />
            </View>
        ));
    };

    setDateRange = (dateRange, isScrollToStartDate) => {
        const { mode, doubleDate = {} } = this.props;
        if (mode === 'doubleDate') {
            this.cellHeader1.current.updateView(dateRange.startDate, this.tabSelected === 0);
            this.cellHeader2.current.updateView(dateRange.endDate, this.tabSelected === 1);
            this.calendarPicker?.current?.setDateRange(dateRange, isScrollToStartDate);
            this.doubleDate = doubleDate ? {
                first: dateRange.startDate ? moment(dateRange.startDate) : null,
                second: dateRange.endDate ? moment(dateRange.endDate) : null
            } : {};
        }
    }

    render() {
        const {
            isOffLunar, isHideHoliday, isHiddenSwitch, isShowLunar, onCallbackCalendar, priceList, labelFrom, labelTo, isHideLabel, minDate, maxDate, doubleDate,
            isHideHeaderPanel
        } = this.props;
        const { isDoubleDateMode } = this.state;
        return (
            <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
                {!isHiddenSwitch && this.renderSwitchReturnSelection()}
                {!isHideHeaderPanel && this.renderHeaderPanel()}
                <CalendarPro
                    ref={this.calendarPicker}
                    startDate={doubleDate?.first}
                    endDate={doubleDate?.second}
                    onDateChange={this.onDateChange}
                    isDoubleDateMode={isDoubleDateMode}
                    selectedDate={this.selectedDate}
                    isShowLunar={isShowLunar}
                    onCallbackCalendar={onCallbackCalendar}
                    priceList={priceList}
                    labelFrom={labelFrom}
                    labelTo={labelTo}
                    isHideLabel={isHideLabel}
                    minDate={minDate}
                    maxDate={maxDate}
                    isHideHoliday={isHideHoliday}
                    isOffLunar={isOffLunar}
                />
            </ScrollView>
        );
    }
}

export default Calendar;

Calendar.propTypes = {
    doubleDate: PropTypes.shape({
        first: PropTypes.any,
        second: PropTypes.any
    }),
    id: PropTypes.any,
    isHiddenSwitch: PropTypes.bool,
    isShowLunar: PropTypes.bool,
    mode: PropTypes.string,
    onCTAStateChange: PropTypes.func,
    onCallbackCalendar: PropTypes.func,
    onDateChange: PropTypes.func,
    selectedDate: PropTypes.any,
    priceList: PropTypes.any,
    labelFrom: PropTypes.string,
    labelTo: PropTypes.string,
    headerFrom: PropTypes.string,
    headerTo: PropTypes.string,
    isHideLabel: PropTypes.bool,
    isHideHoliday: PropTypes.bool,
    minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
};

Calendar.defaultProps = {
    mode: 'single',
    isHiddenSwitch: false
};

const styles = StyleSheet.create({
    viewPanel_2: {
        height: 46,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8
    },
    viewPanel: {
        height: 50,
        marginHorizontal: 12,
        marginTop: 6,
        marginBottom: 25,
        padding: 2,
        flexDirection: 'row',
        backgroundColor: '#eeeeef',
        justifyContent: 'space-around',
        borderRadius: 8
    },
    textSwitch: {
        // fontSize: 10,
        fontWeight: 'bold',
        color: '#222222'
    },
    viewSwitch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        alignItems: 'center',
        backgroundColor: '#f2f3f5',
        paddingVertical: 9,
        height: 42
    },
});
