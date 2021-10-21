import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

export const TargetSituation = (props) => {

    return (
        <View style={{ justifyContent: 'center', borderRadius: 10, backgroundColor: props.backgroundColor, width: props.width, marginBottom: props.marginBottom ? props.marginBottom : 0, alignItems: 'center' }}>
            <Text style={styles.targetText}> {props.text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    targetText: {
        alignItems: 'center',
        color: '#fff',
        borderRadius: 10,
        fontSize: 10,
        fontFamily: 'Poppins-SemiBold',
        marginVertical: 2
    }
});
