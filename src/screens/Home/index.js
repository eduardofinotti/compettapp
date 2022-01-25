import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, FlatList, View, Image, Text, Animated, TouchableWithoutFeedback, SafeAreaView, Pressable } from 'react-native';
import Event from '../../components/Event';

import Input from '../../components/Input';

import { UserContext } from '../../context/Context';
const logo = require('../../assets/images/logo.png')

const avatar_logo = require('../../assets/images/avatar-kimono.png')
const arrow_up = require('../../assets/images/up-arrow.png')

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Home({ navigation }) {

    const { user, setUser } = useContext(UserContext)

    console.log(user)

    const [avatar, setAvatar] = useState('')
    const [search, setSearch] = useState('')

    const flatlistRef = useRef();

    let event = [
        {
            name: 'Floripa BJJ Champion',
            local: 'Rio de Janeiro - Arena Da Juventude',
            date: '16 e 17/10/2021',
            ending_subscription: false,
            end_subscription: true,
            link: 'www.goo212g2le.com',
            banner: 'https://s3-sa-east-1.amazonaws.com/lets.events-production/events/photos/ed8/685/c2-/cover/data?1570479668'
        },
        {
            name: 'Floripa BJJ Champion',
            local: 'Rio de Janeiro - Arena Da Juventude',
            date: '16 e 17/10/2021',
            ending_subscription: true,
            end_subscription: false,
            link: 'www.googl1e.com',
            banner: 'https://www.graciemag.com/wp-content/uploads/2019/04/0.jpg'
        },
        {
            name: 'Floripa BJJ Champion',
            local: 'Rio de Janeiro - Arena Da Juventude',
            date: '16 e 17/10/2021',
            ending_subscription: false,
            end_subscription: false,
            link: 'www.goog2le.com',
            banner: 'https://www.graciemag.com/wp-content/uploads/2019/06/IMG-20190626-WA0026.jpg'
        },
        {
            name: 'Floripa BJJ Champion',
            local: 'Rio de Janeiro - Arena Da Juventude',
            date: '16 e 17/10/2021',
            ending_subscription: false,
            end_subscription: false,
            link: 'www.goog122le.com',
            banner: 'https://jiujitsubjj.com/wp-content/uploads/2019/08/2ciampabanner.jpeg-1.jpg'
        },
        {
            name: 'Floripa BJJ Champion',
            local: 'Rio de Janeiro - Arena Da Juventude',
            date: '16 e 17/10/2021',
            ending_subscription: false,
            end_subscription: false,
            link: 'www.goog22x12le.com',
            banner: 'https://www.graciemag.com/wp-content/uploads/2019/04/0.jpg'
        },
        {
            name: 'Floripa BJJ Champion',
            local: 'Rio de Janeiro - Arena Da Juventude',
            date: '16 e 17/10/2021',
            ending_subscription: false,
            end_subscription: false,
            link: 'www.goog22oole.com',
            banner: 'https://www.graciemag.com/wp-content/uploads/2019/04/0.jpg'
        },
        {
            name: 'Floripa BJJ Champion',
            local: 'Rio de Janeiro - Arena Da Juventude',
            date: '16 e 17/10/2021',
            ending_subscription: false,
            end_subscription: false,
            link: 'www.goog982le.com',
            banner: 'https://www.graciemag.com/wp-content/uploads/2019/04/0.jpg'
        },
    ]

    const moveCalc = useRef(new Animated.Value(0)).current

    let heightView = moveCalc.interpolate({
        inputRange: [0, 60],
        outputRange: [130, 0],
        extrapolate: 'clamp'
    });
    let heightImage = moveCalc.interpolate({
        inputRange: [0, 60],
        outputRange: [120, 0],
        extrapolate: 'clamp',
    });
    let opacityView = moveCalc.interpolate({
        inputRange: [0, 20],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    const [events, setEvents] = useState(event)

    async function goToProfile() {
        if (user != null) {
            navigation.navigate('Profile')
        }
    }

    function searchPosition(text) {
        setSearch(text)

        let array = [...event]

        const newData = array.filter(function (item) {
            const itemData = item.name.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1
        });

        setEvents(newData)
    }

    function onPressFunction() {
        flatlistRef.current.scrollToIndex({ index: 0 });
    }

    function goToLogin() {
        setUser({ user: null })
        AsyncStorage.setItem('@token', "")
        navigation.navigate('Login')
    }

    return (
        <SafeAreaView style={styles.content} >
            <View style={styles.headerContent}>
                <TouchableWithoutFeedback onPress={goToProfile}>
                    <Image source={user.profile_photo ? { uri: user.profile_photo } : avatar_logo} style={styles.avatar} resizeMode="cover" />
                </TouchableWithoutFeedback>

                <Image source={logo} style={styles.logo} resizeMode="contain" />

                <TouchableWithoutFeedback onPress={goToLogin} >
                    <Icon name="sign-out" size={20} color="#fff" />
                </TouchableWithoutFeedback>

            </View>

            <View style={{ flex: 1, }}>
                <Animated.View style={[{ alignItems: 'center', height: heightView }]}>
                    <Animated.View style={{ justifyContent: 'space-between', opacity: opacityView, height: heightImage, width: '100%', paddingHorizontal: 20 }} >
                        <Text style={styles.searchSubtitle}>Veja as próximas competições</Text>
                        <View style={styles.inputContent} >
                            <Input
                                placeholder="Competições"
                                icon="magnify"
                                onChange={text => {
                                    searchPosition(text)
                                }}
                            />
                        </View>
                    </Animated.View>
                </Animated.View>

                <FlatList
                    ref={flatlistRef}
                    data={events}
                    renderItem={({ item }) => (
                        <Event item={item} navigation={navigation} />
                    )}
                    onScroll={
                        Animated.event(
                            [{ nativeEvent: { contentOffset: { y: moveCalc } } }],
                            { useNativeDriver: false },
                        )
                    }
                    scrollEventThrottle={16}
                // onScrollBeginDrag={() => setShowScrollUp(true)}
                />
                {events.length > 1 &&
                    <Pressable onPress={onPressFunction} style={{ position: 'absolute', bottom: 15, right: 10 }}>
                        <Image source={arrow_up} style={{ width: 30, height: 30, marginBottom: 5 }} />
                    </Pressable>
                }
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#18181c',
    },

    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20
    },

    logo: {
        width: 150,
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20
    },

    searchContent: {
        width: '100%',
        height: 120,
        justifyContent: 'space-between'
    },

    searchSubtitle: {
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        width: '60%',
        opacity: 0.7
    },

    inputContent: {
        flexDirection: 'row',
        height: 60,
        color: '#fff',
        marginTop: -50,
    },
});
