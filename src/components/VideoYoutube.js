import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
import Icon from 'react-native-vector-icons/Ionicons';

export default function VideoYoutube(props) {

    return (
        <View style={{ paddingHorizontal: 30, paddingBottom: 20 }}>
            <View style={styles.titleContent}>
                <Text style={styles.titleText}>{props.item.title}</Text>
            </View>

            <Text style={styles.descriptionText}>{props.item.description}</Text>

            <YoutubePlayer
                height={200}
                play={false}
                videoId={props.item.config.id} />
        </View>
    );
};

const styles = StyleSheet.create({
    titleContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5
    },
    titleText: {
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14
    },
    descriptionText: {
        color: '#fff',
        fontFamily: 'Poppins-Regular',
        fontSize: 11,
        opacity: 0.6
    }
});
