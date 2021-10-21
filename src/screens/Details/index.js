import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, TouchableOpacity, Text, ImageBackground } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

import { UserContext } from '../../context/Context';

const axios = require('axios');
const baseUrl = require('../../api/apiConfigDevelop').baseUrl();

import Input from '../../components/Input';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
const logo = require('../../assets/images/logo.png')
const banner = require('../../assets/images/data.jpeg')
const calendar_icon = require('../../assets/images/calendar.png')
import Icon from 'react-native-vector-icons/Ionicons';
import IconW from 'react-native-vector-icons/FontAwesome';

import { ScrollView } from 'react-native-gesture-handler';
import { TargetSituation } from '../../components/TargetSituation';

export default function Details(props) {

    const { item } = props.route.params

    console.log(item.item.ending_subscription)

    function backToHome() {
        item.navigation.navigate('MainNavigation')
    }

    return (
        <SafeAreaView style={styles.container}>

            <ImageBackground source={banner} resizeMode="cover" style={styles.banner}>
            </ImageBackground>

            <TouchableOpacity onPress={() => backToHome()} style={styles.backToHome}>
                <IconW name="long-arrow-left" size={40} color="#fff" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.infoContainer}>

                <View style={styles.titleContainer}>
                    <View style={styles.titleContent}>
                        <Text style={styles.titleText}>Festival de JIU-JITSU</Text>
                    </View>
                    <View style={styles.localDateContent}>
                        <View style={styles.info}>
                            <Image source={calendar_icon} style={styles.calendarIcon} />
                            <Text style={styles.infoText}>10 de Outubro de 2021</Text>
                        </View>

                        <View style={styles.info}>
                            <Icon name="location-sharp" size={13} color="#E74C3C" style={styles.infoLogo} />
                            <Text style={styles.infoText}>Joinville/SC</Text>
                        </View>
                    </View>
                </View>

                {item.item.ending_subscription &&
                    <TargetSituation backgroundColor={"#E74C3C"} text={"3 dias pra encerrar incrições"} width={'40%'} marginBottom={10} />
                }

                {item.item.end_subscription &&
                    <TargetSituation backgroundColor={"#000"} text={"Incrições encerradas"} width={'40%'} marginBottom={10} />
                }

                {item.item.end_subscription == false && item.item.ending_subscription == false &&
                    <TargetSituation backgroundColor={"green"} text={"Incrições Abertas"} width={'40%'} marginBottom={10} />
                }

                <View style={styles.sectionContainer}>
                    <View style={styles.sectionTitleContent}>
                        <Text style={styles.sectionTitleText}>SOBRE O EVENTO</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', height: 100, backgroundColor: '#1F1F1F', borderRadius: 10, marginVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ padding: 5, marginHorizontal: 2 }}>
                            <Text style={{ color: '#fff', fontFamily: 'Poppins-Regular', textAlign: 'center' }}>Vimos através desta, convidar a todos os professores e atletas para participarem de mais uma edição do campeonato Copa Strong 2021.</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <View style={styles.sectionTitleContent}>
                        <Text style={styles.sectionTitleText}>DATAS E PRAZOS DO EVENTO</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', height: 190, backgroundColor: '#1F1F1F', borderRadius: 10, marginVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitleText}>DATA DO EVENTO</Text>
                                <Text style={styles.infoText}>10 de Outubro de 2021</Text>
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitleText}>INSCRIÇÕES</Text>
                                <Text style={styles.infoText}>30/08 até 06/10 às 20:50h</Text>
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitleText}>LIMITE PARA O PAGAMENTO</Text>
                                <Text style={styles.infoText}>Até 06/10 às 21:50h</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'column' }}>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitleText}>CHECAGEM</Text>
                                <Text style={styles.infoText}>07/10 08h até 08/10 20h</Text>
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitleText}>CHAVES</Text>
                                <Text style={styles.infoText}> 08/10 a partir das 21h</Text>
                            </View>

                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitleText}>CRONOGRAMA</Text>
                                <Text style={styles.infoText}>08/10 a partir das 12:00h</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <View style={styles.sectionTitleContent}>
                        <Text style={styles.sectionTitleText}>VALORES DAS INSCRIÇÕES</Text>

                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', height: 160, backgroundColor: '#1F1F1F', borderRadius: 10, marginVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={{ padding: 5, marginHorizontal: 2 }}>
                                <Text style={{ color: '#E74C3C', fontFamily: 'Poppins-SemiBold' }}>*** Incluso teste Covid no Dia do Campeonato se o decreto exigir (teste grátis)</Text>
                                <Text style={{ color: '#fff', fontFamily: 'Poppins-Bold', marginTop: 10 }}>1º Lote 20/09</Text>
                                <Text style={{ color: '#fff', fontFamily: 'Poppins-Regular', marginTop: 10 }}>- Categoria de Peso Até 15 anos: R$ 100,00</Text>
                                <Text style={{ color: '#fff', fontFamily: 'Poppins-Regular', marginTop: 10 }}>- Categoria de Peso Acima de 15 anos: R$ 130,00</Text>
                            </View>

                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#18181c',
        alignItems: 'center'
    },

    banner: { height: 220, width: '100%', top: 0, opacity: 0.5, position: 'absolute' },

    backToHome: {
        width: '100%',
        marginLeft: 30
    },

    infoContainer: { justifyContent: 'center', alignItems: 'center', paddingTop: 90 },

    titleContainer: { width: 280, height: 100, backgroundColor: '#1F1F1F', borderRadius: 10, padding: 10, marginBottom: 15 },
    titleContent: { alignItems: 'center', justifyContent: 'center' },
    titleText: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#fff' },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 2
    },

    localDateContent: {
        justifyContent: 'center',
        height: '80%',
        marginLeft: 20
    },

    calendarIcon: { width: 12, height: 12, marginBottom: 5, marginRight: 4 },
    infoText: {
        color: '#fff',
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
    },


    sectionContainer: { width: '100%', paddingHorizontal: 20, alignItems: 'center', paddingVertical: 10 },
    sectionTitleContent: { alignItems: 'flex-start', width: '100%' },
    infoLogo: {
        marginTop: -5,
    },

    sectionTitleText: { color: '#fff', fontFamily: 'Poppins-Bold' },
    infoTextContainer: { padding: 10, alignItems: 'center', justifyContent: 'center', marginHorizontal: 5 },
    infoTitleText: { color: '#E74C3C', fontFamily: 'Poppins-SemiBold', fontSize: 12 },
});

