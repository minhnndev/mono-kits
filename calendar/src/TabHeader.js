import React from 'react';
import { TouchableWithoutFeedback, View, Text } from 'react-native';
import Moment from 'moment';
import Util from './Util';

export default class TabHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: props.activeTab
        };
        this.label = props.label;
        this.defaultDate = props.date ? Moment(props.date) : '';
    }

    onChangeTab = () => {
        const { onChangeTab, id } = this.props;
        if (onChangeTab) {
            onChangeTab(id);
        }
    };

    updateView = (date, activeTab) => {
        this.setState({
            date: date ? Moment(date) : '',
            active: activeTab
        });
    };

    setActiveTab = (active) => {
        this.setState({ active });
    };

    render() {
        const { label, disabled } = this.props;
        const { date, active } = this.state;
        const formattedDateFromState = date ? date.format('DD/MM/YYYY') : '';
        const formattedDateFromDefault = this.defaultDate ? this.defaultDate.format('DD/MM/YYYY') : '';
        const dayOfWeekFromState = date ? `${Util.WEEKDAYSFROMMOMENT[date.day()]} -` : '';
        const dayOfWeekFromDefault = this.defaultDate ? `${Util.WEEKDAYSFROMMOMENT[this.defaultDate.day()]} -` : '';

        return (
            <TouchableWithoutFeedback disabled={disabled} onPress={this.onChangeTab}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: active ? 'white' : '#eeeeef',
                    borderRadius: 8
                }}
                >
                    <Text style={{
                        fontSize: 12,
                        // lineHeight: 14,
                        color: active ? '#222222' : '#8d919d',
                        fontWeight: 'bold'
                    }}
                    >
                        {label}

                    </Text>
                    <Text style={{
                        marginTop: 3,
                        fontSize: 12,
                        // lineHeight: 14,
                        color: '#8d919d'
                    }}
                    >
                        <Text style={{ color: active ? '#b0006d' : '#8d919d', fontWeight: 'bold' }}>
                            {`${dayOfWeekFromState || dayOfWeekFromDefault || '--'} `}

                        </Text>
                        {formattedDateFromState || formattedDateFromDefault || '--/--/----'}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
