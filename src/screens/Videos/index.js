import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TextInput, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
import Input from '../../components/Input';
import AwesomeAlert from 'react-native-awesome-alerts';

const axios = require('axios');
const baseUrl = require('../../api/apiConfigDevelop').baseUrl();

import HeaderAnimated from "../../components/HeaderAnimated";

import Icon from 'react-native-vector-icons/Ionicons';
import VideoYoutube from '../../components/VideoYoutube';
const logo = require('../../assets/images/logo.png')

export default function Videos({ navigation }) {

    const [showAlertWait, setShowAlertWait] = useState(true);

    const [search, setSearch] = useState('')
    const [positions, setPositions] = useState([])
    const [page, setPage] = useState(1)

    function searchPosition(text) {
        setSearch(text)

        let array = [...positions]

        console.log(array)
        const newData = array.filter(function (item) {
            const itemData = item.title.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1
        });

        setPositions(newData)
    }

    useEffect(async () => {
        await getVideos()
    }, [])

    async function getVideos() {
        setShowAlertWait(true)
        setPage(page + 1)

        await axios.post(`https://combatt-api.herokuapp.com/videos-classes/find/paginate`, {
            "filters": {
                "title": { "$regex": "" }
            },
            "sort": {
                "title": ""
            },
            "paginate": {
                "page": 1,
                "limitByPage": 1000
            }
        })
            .then(function (response) {
                let newPositions = null

                if (response.data.results.length > 0) {
                    if (positions.length < 1) {
                        newPositions = response.data.results;
                    } else {
                        newPositions = [...positions, ...response.data.results];
                    }
                    setPositions(newPositions);
                }
            })
            .catch(function (err) {
                console.log(err);
            });

        setShowAlertWait(false)
    }

    function changePage() {
        getVideos()
    }

    return (
        <SafeAreaView style={styles.content} >
            <View style={styles.headerContent}>
                <Text style={styles.title}>Vídeos</Text>
            </View>

            <HeaderAnimated
                data={positions}
                renderItem={({ item }) => (
                    <VideoYoutube item={item} />
                )}
                // changePage={changePage}
                keyExtractor={item => item.title}
                height={70}
                from={0}
                to={30}
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

            <AwesomeAlert
                show={showAlertWait}
                showProgress={true}
                title="Aguarde..."
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
            />
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#18181c'
    },

    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        marginTop: 10,
        paddingVertical: 20,

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
    descriptionText: {
        color: '#fff',
        fontFamily: 'Poppins-Regular',
        fontSize: 11,
        opacity: 0.6
    }
});