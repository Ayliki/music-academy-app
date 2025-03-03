import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    scheduleContainer: {
        flex: 1,
        paddingHorizontal: 16,
        marginBottom: 32,
    },
    scheduleTable: {
        flexDirection: 'row',
    },
    leftColumn: {
        width: 90,
        borderRightWidth: 2,
        borderRightColor: '#ccc',
    },
    rightColumn: {
        flex: 1,
        paddingLeft: 10,
    },
    columnHeader: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666666',
        marginBottom: 12,
    },
    timeRow: {
        marginBottom: 80,
        alignItems: 'flex-start',
    },
    startTime: {
        fontSize: 20,
        fontWeight: '600',
        color: '#66666',
    },
    endTime: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ABABAB',
    },
    lessonCard: {
        flex: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 25,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    lessonName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    roomText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 2,
    },
    instructorText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    groupText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    studentText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 8,
    },
    confirmButton: {
        backgroundColor: '#E2FBE3',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 15,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
        minWidth: 80,
    },
    cancelButton: {
        backgroundColor: '#E83D3D',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 15,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
        minWidth: 80,
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000000',
    },
    confirmedText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 8,
    },
    canceledText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 8,
    },
    statusPositive: {
        backgroundColor: '#E2FBE3',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 15,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
        minWidth: 80,
    },
    statusNegative: {
        backgroundColor: '#E83D3D',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 15,
        fontWeight: '400',
        fontSize: 12,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
        minWidth: 80,
    }
});

export default styles;