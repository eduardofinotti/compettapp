import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function Divider(props) {

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', opacity: 0.5, margin: 20 }}>
            <View style={[styles.hairline, { width: props.widthEachLine }]} />

            {props.text &&
                <Text style={styles.loginButtonBelowText1}>{props.text}</Text>
            }
            <View style={[styles.hairline, { width: props.widthEachLine }]} />

        </View>
    );
};

const styles = StyleSheet.create({

    hairline: {
        backgroundColor: '#A2A2A2',
        height: 1,
    },

    loginButtonBelowText1: {
        fontFamily: 'AvenirNext-Bold',
        fontSize: 14,
        paddingHorizontal: 5,
        alignSelf: 'center',
        color: '#A2A2A2'
    },
});
