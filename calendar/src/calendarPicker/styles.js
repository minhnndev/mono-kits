import { Dimensions, StyleSheet } from 'react-native';

const widthScreen = Dimensions.get('window').width;

const styles = StyleSheet.create({
    calendar: {
    // height:widthScreen - 20,
        backgroundColor: 'white',
        borderColor: '#DADADA',
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },
    dayWrapper: {
        width: widthScreen / 7,
        height: 40,
        backgroundColor: 'rgba(0,0,0,0.0)'

    },

    dayButton: {
        width: 50,
        height: 50,
        alignSelf: 'center'
    },

    styleFirstDate: {
        position: 'absolute',
        // width:45,
        height: 40,
        top: 0,
        left: widthScreen / 14,
        right: -1,
        backgroundColor: '#90d6f3',
        borderRadius: 0
    },
    styleSecondDate: {
        position: 'absolute',
        // width:45,
        height: 40,
        top: 0,
        right: widthScreen / 14,
        left: 0,
        backgroundColor: '#90d6f3',
        borderRadius: 0
    },
    styleBetween: {
        height: 40,
        // width:60,
        top: 0,
        left: 0,
        right: -1,
        position: 'absolute',
        backgroundColor: '#90d6f3',
        borderRadius: 0
    },
    dayButtonSelected: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2eb3e8',
        alignSelf: 'center'
    },

    dayButtonNow: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#8F8E94',
        alignSelf: 'center'
    },

    dayLabel: {
        fontSize: 16,
        color: '#393939',
        marginTop: 10,
        alignSelf: 'center'
    },

    dayLabelsWrapper: {
        width: widthScreen,
        flexDirection: 'row',
        marginBottom: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderColor: '#DADADA',
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },

    daysWrapper: {
        alignSelf: 'center',
    },

    dayLabels: {
        width: widthScreen / 7,
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
    },

    selectedDay: {
        width: 60,
        height: 60,
        backgroundColor: '#5ce600',
        borderRadius: 30,
        alignSelf: 'center'
    },

    monthLabel: {
        fontSize: widthScreen > 320 ? 20 : 17,
        fontWeight: '300',
        color: '#000',
        width: 180,
        textAlign: 'center'
    },

    headerWrapper: {
        width: widthScreen,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginVertical: 10,
        backgroundColor: 'rgba(0,0,0,0.0)'
    },

    monthSelector: {
        width: 80,
    },

    prev: {
        textAlign: 'left',
        fontSize: 16,
        color: '#dadada',
    },

    next: {
        textAlign: 'right',
        fontSize: 16,
        color: '#dadada',
    },

    yearLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center'
    },

    weeks: {
        flexDirection: 'column'
    },

    weekRow: {
        flexDirection: 'row'
    },
    btnCellHeader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DADADA',
        backgroundColor: 'white'
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtDate: {
        color: '#4D4D4D',
        fontSize: 18,
        fontWeight: 'bold',
        paddingVertical: 10
    },
    lineActiveTab: {
        height: 3,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: '#49A3BC'
    }
});

export default styles;
