import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Image, ImageBackground, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Snackbar from 'react-native-snackbar';

import { UserContext } from '../../context/Context';
const baseUrl = require('../../api/apiConfigDevelop').baseUrl();

const image_background = require('../../assets/images/image-background.png')
const logo = require('../../assets/images/logo.png')
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

import messaging from '@react-native-firebase/messaging';

export default function Onboarding({ navigation }) {

    const { user, setUser } = useContext(UserContext)

    const [isToken, setIsToken] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    function goToLogin() {
        navigation.navigate('Login')
    }

    async function saveTokenToDatabase(token) {
        console.log(token)
    }

    useEffect(async () => {
        // await AsyncStorage.clear()
        setIsLoading(true)

        getFirebaseToken()
        getMessages()

        let my_token = await AsyncStorage.getItem('@token')

        if (my_token != null) {
            console.log('tem token')
            await axios.get(`${baseUrl}/users/logged`, {
                headers: {
                    "x-access-token": my_token,
                    "Content-Type": "application/json"
                }
            })
                .then(async function (response) {
                    await setUser(response.data)
                })

            //update no token do banco

            navigation.navigate('MainNavigation')
        } else {
            setTimeout(() => {
                setIsLoading(false)
                setIsToken(false)
            }, 2000);
        }
    }, [])

    function getMessages() {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('ainnnn')
            Snackbar.show({
                text: remoteMessage.notification.body,
                duration: Snackbar.LENGTH_SHORT,
                action: {
                    text: 'OK',
                    textColor: '#F55B6A',
                },
            });
        });

        return unsubscribe;
    }

    function getFirebaseToken() {
        messaging()
            .getToken()
            .then(token => {
                return saveTokenToDatabase(token);
            });

        return messaging().onTokenRefresh(token => {
            saveTokenToDatabase(token);
        });
    }

    return (
        <ImageBackground source={image_background} resizeMode="cover" style={styles.image_background} >
            <View style={styles.content} >
                <View style={styles.logoContent}>
                    <Image resizeMode="contain" source={logo} style={styles.logo} />
                </View>

                {isLoading &&
                    <ActivityIndicator size="large" />
                }

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Seu app de competições</Text>

                    {!isToken &&
                        <TouchableOpacity style={styles.nextScreenButtonContent} onPress={() => goToLogin()} >
                            <Icon name="long-arrow-right" size={50} color="#fff" />
                        </TouchableOpacity>
                    }

                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    image_background: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'space-between',
        paddingVertical: 60
    },
    logoContent: {
        alignItems: 'center',
    },
    logo: {
        width: 280
    },
    footer: {
        paddingLeft: 20,
        flexDirection: 'row'
    },
    footerText: {
        color: '#fff',
        fontSize: 38,
        lineHeight: 50,
        fontFamily: 'Poppins-SemiBold',
        width: '70%'
    },
    nextScreenButtonContent: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingRight: 30,
        flex: 1
    },

});
