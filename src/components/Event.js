import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image,
} from 'react-native';

import AwesomeAlert from 'react-native-awesome-alerts';

import { TargetSituation } from './TargetSituation';

import Icon from 'react-native-vector-icons/Ionicons';
import IconW from 'react-native-vector-icons/FontAwesome';
const calendar_icon = require('../../src/assets/images/calendar.png')

import { UserContext } from '../context/Context';
import AsyncStorage from '@react-native-community/async-storage';

export default function Event(props, { navigation }) {

    const { user, setUser } = useContext(UserContext)
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');

    useEffect(async () => {
    }, [])

    async function goToEventPage() {
        const my_token = await AsyncStorage.getItem('@token')

        if (my_token) {
            props.navigation.navigate('Details', { item: props })
        } else {
            setMessageAlert("Ops... Você precisa fazer login para acessar a competição!")
            setShowAlert(true)
        }
    }

    return (
        <TouchableOpacity style={styles.eventContent} onPress={goToEventPage}>
            <Image source={{ uri: props.item.banner }} style={{ width: 123 }} />

            <View style={styles.infoContent}>
                <View style={styles.titleContent}>
                    <Text style={styles.title}>Floripa BJJ Champion</Text>
                    <IconW style={{ marginRight: 20 }} name="long-arrow-right" size={15} color="#fff" />
                </View>

                {props.item.ending_subscription &&
                    <TargetSituation backgroundColor={"#E74C3C"} text={"3 dias pra encerrar incrições"} width={'70%'} />
                }

                {props.item.end_subscription &&
                    <TargetSituation backgroundColor={"#000"} text={"Incrições encerradas"} width={'60%'} />
                }

                {props.item.end_subscription == false && props.item.ending_subscription == false &&
                    <TargetSituation backgroundColor={"green"} text={"Incrições Abertas"} width={'60%'} />
                }

                <View style={styles.localDateContent}>
                    <View style={styles.info}>
                        <Image source={calendar_icon} style={{ width: 12, height: 12, marginBottom: 5 }} />
                        <Text style={styles.infoText}>{props.item.date}</Text>
                    </View>

                    <View style={styles.info}>
                        <Icon name="location-sharp" size={13} color="#E74C3C" style={styles.infoLogo} />
                        <Text style={styles.infoText}>{props.item.local}</Text>
                    </View>
                </View>
            </View>

            <AwesomeAlert
                contentStyle={{ width: 300 }}
                show={showAlert}
                showProgress={false}
                title="Alerta"
                message={messageAlert}
                titleStyle={{ fontFamily: 'Poppins-Regular' }}
                messageStyle={{ fontFamily: 'Poppins-Regular', textAlign: 'center', alignItems: 'center' }}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor="#F55B6A"
                onConfirmPressed={() => {
                    setShowAlert(false)
                    props.navigation.navigate('Login')
                }}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    eventContent: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 10,
        height: 95,
        padding: 5,
        backgroundColor: '#1C1C22',
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#000',
        shadowOpacity: 0.3,
        elevation: 2,
    },

    infoContent: {
        marginHorizontal: 10,
        width: '65%',
        justifyContent: 'space-between',
    },

    titleContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    title: {
        color: '#fff',
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
    },

    localDateContent: {
    },

    info: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 2
    },

    infoText: {
        color: '#fff',
        opacity: 0.7,
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        marginLeft: 4,
    },

    infoLogo: {
        marginTop: -5,
    },

    acessEventContent: {
        alignItems: 'flex-end',
    },


    titleBotton: {
        width: '100%',
        color: '#fff',
        padding: 6,
        fontFamily: 'Poppins-Regular',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        marginBottom: -10,
        fontSize: 11
    },
    acessAventText: {
        width: '100%',
        color: '#fff',
        padding: 6,
        fontFamily: 'Poppins-SemiBold',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        marginBottom: -10,
        fontSize: 11
    },
    needLoginText: {
        width: '100%',
        color: '#fff',
        padding: 6,
        fontFamily: 'Poppins-SemiBold',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        marginBottom: -10,
        fontSize: 11,
        opacity: 0.5
    },
    footerContent: {
        justifyContent: 'center',
        marginBottom: -10,

    },
    footerInfo: {
        flexDirection: 'row',
        backgroundColor: '#000',
        alignItems: 'center',
        paddingLeft: 5,
        paddingBottom: 3,
        width: '100%'
    },
    iconStyle: {
        opacity: 0.9,
        marginTop: 6
    },

});
