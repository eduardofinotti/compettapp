import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TextInput, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
import Input from '../../components/Input';

import HeaderAnimated from "../../components/HeaderAnimated";

import Icon from 'react-native-vector-icons/FontAwesome';
const logo = require('../../assets/images/logo.png')

export default function Favorites({ navigation }) {

    const [search, setSearch] = useState('')
    const [newPositions, setNewPositions] = useState(positions)

    let positions = [
        {
            name: 'Armlock',
            link: 'TUG66clvqyw'
        },
        {
            name: 'Raspagem',
            link: 'N7NtLpeP0MY'
        },
        {
            name: 'Saída 100KG',
            link: 'OwyjijN3U9k'
        }]

    function searchPosition(text) {
        console.log(text)
        setSearch(text)

        let array = [...positions]

        const newData = array.filter(function (item) {
            const itemData = item.name.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1
        });

        setNewPositions(newData)
    }

    useEffect(() => {
        setNewPositions(positions)
    }, [])

    return (
        <SafeAreaView style={styles.content} >
            <View style={styles.headerContent}>
                <Text style={styles.title}>Vídeos Favoritos</Text>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('MainNavigation', {
                        screen: 'Videos'
                    });
                }}>
                    <Icon name="arrow-left" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <HeaderAnimated
                data={newPositions}
                renderItem={({ item }) => (
                    <View style={{ paddingHorizontal: 30, paddingBottom: 20 }}>
                        <View style={styles.titleContent}>
                            <Text style={styles.titleText}>{item.name}</Text>
                            <Icon name="star" size={20} color="yellow" />
                        </View>

                        <YoutubePlayer
                            height={200}
                            play={false}
                            videoId={item.link}
                        />
                    </View>
                )}
                keyExtractor={item => item.link}
                height={70}
                from={0}
                to={20}
                color={'#18181c'}
            >

                <View style={styles.inputContent}>
                    <Input
                        placeholder="Posições"
                        icon="magnify"
                        onChange={text => {
                            searchPosition(text)
                        }}
                    />
                </View>

            </HeaderAnimated>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#18181c',
    },

    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'space-between',
        marginTop: 10
    },

    title: {
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
    },

    logo: {
        width: 100,
    },

    inputContent: {
        flexDirection: 'row',
        height: 60,
        color: '#fff',
        marginTop: -50
    },

    input: {
        flex: 1,
        fontFamily: 'Poppins-Regular',
        backgroundColor: '#18181c',
        color: '#fff'
    },

    iconStyle: {
        marginRight: 10,
        opacity: 0.4
    },

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

    videosContent: {
        marginTop: 20,
    }

});