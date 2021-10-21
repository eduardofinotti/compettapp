import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Image, Keyboard, TouchableOpacity, Platform, ImageBackground } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

import { Avatar } from '../../components/Avatar';
import ImgToBase64 from 'react-native-image-base64';
const { base64encode, base64decode } = require('nodejs-base64');

var isValidEmail = require("email-validator");
import address from 'cep-promise'
import isValidCep from '@brazilian-utils/is-valid-cep';

import axios from 'axios';
const baseUrl = require('../../api/apiConfigDevelop').baseUrl();

import { UserContext } from '../../context/Context';

import Icon from 'react-native-vector-icons/FontAwesome';
const logo = require('../../assets/images/logo-mini-w.png')

const image_background = require('../../assets/images/belt.png')

import Input from '../../components/Input';
import AsyncStorage from '@react-native-community/async-storage';

export default function Register({ navigation }) {

    const { user, setUser } = useContext(UserContext)

    const [showHeader, setShowHeader] = useState(true);

    const [avatar, setAvatar] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cep, setCep] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [addressComplete, setAddresComplete] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showWait, setShowWait] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setShowHeader(false)
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setShowHeader(true)
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    function backToLogin() {
        navigation.navigate('Login')
    }

    async function getAddress(cep) {
        setCep(cep)

        if (await isValidCep(cep)) {
            await address(cep)
                .then(async result => {
                    setAddresComplete(`${result.city} - ${result.state}`)
                    setCity(result.city)
                    setState(result.state)
                })
                .catch(() => {
                    setAddresComplete('')
                })
        } else {
            setAddresComplete('')
        }
    }

    function handlerShowAlert(message) {
        setMessageAlert(message)
        setShowAlert(true)
    };

    function handlerHideAlert() {
        setShowAlert(false)
    };

    async function cadastrar() {
        if (email == '' || name == '' || cep == '' || addressComplete == '' || password == '') {
            handlerShowAlert('Todos os campos devem ser preenchidos!')
            return
        }

        if (addressComplete == '') {
            handlerShowAlert('O CEP é inválido!')
            return
        }

        if (password != confirmPassword) {
            handlerShowAlert('As senhas não conferem!')
            return
        }

        if (password.length < 6) {
            handlerShowAlert('A senha deve ter pelo menos 6 dígitos!')
            return
        }

        if (!isValidEmail.validate(email)) {
            handlerShowAlert('O e-mail é inválido!')
            return
        }

        setShowWait(true)

        await axios.post(`${baseUrl}/users`, {
            email: email,
            name: name,
            password: password,
            profile_photo: avatar,
            address:
            {
                cep: cep,
                city: city,
                state: state
            },
            id_user_type: "competitor",
        })
            .then(async function (response) {
                if (response.status == 201) {
                    try {
                        await axios.post(`${baseUrl}/login`, {
                            email: email,
                            password: password
                        })
                            .then(async function (response) {
                                if (response.data.auth && response.data.token) {
                                    try {
                                        setUser(response.data.user)
                                        await AsyncStorage.setItem('@token', response.data.token)

                                    } catch (error) {
                                        console.log('Erro ao salvar token do usuário.')
                                    }
                                    navigation.navigate('MainNavigation')
                                } else {
                                    setLoginError(true)
                                }
                            })
                            .catch(function (error) {
                                handlerShowAlert('Erro ao realizar login. Volta para a tela de login e tenta novamente.')
                                console.log(error);
                            });
                    } catch (error) {
                        console.log('Erro ao salvar token do usuário.')
                    }
                } else {
                    setLoginError(true)
                }
            })
            .catch(function (error) {
                handlerShowAlert('Erro ao realizar cadastro. Verifique e tente novamente.')
                console.log(error);
            });
        setShowWait(false)
    }

    async function onAvatarChange(image) {
        await ImgToBase64.getBase64String(image.path)
            .then(base64String => {
                let encoded = base64encode(base64String); // "aGV5ICB0aGVyZQ=="
                setAvatar(encoded)
            })
            .catch(err => console.log(err));
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior='padding' >
            <ImageBackground source={image_background} resizeMode="cover" imageStyle={{ opacity: 0.03, marginRight: -200 }} style={{ flex: 1 }}>
                {showHeader &&
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => backToLogin()} >
                            <Icon name="long-arrow-left" size={40} color="#fff" />
                        </TouchableOpacity>

                        <Image source={logo} style={styles.logo} resizeMode="contain" />
                    </View>
                }

                {!showHeader &&
                    <View style={{ marginTop: 250 }}></View>
                }

                <View style={styles.registerContent}>

                    <View style={{ paddingBottom: 20, marginTop: -80 }}>
                        <Avatar
                            onChange={onAvatarChange}
                            source={require('../../assets/images/avatar-kimono.png')}
                        />
                    </View>
                    <View style={styles.inputContent}>
                        <Input
                            placeholder="Nome completo"
                            icon="account"
                            onChange={(txt) => { setName(txt) }}
                        />
                    </View>

                    <View style={styles.inputContent}>
                        <Input
                            placeholder="E-mail"
                            icon="email"
                            autoCapitalize='none'
                            keyboardType="email-address"
                            onChange={(txt) => { setEmail(txt) }}
                        />
                    </View>

                    <View style={styles.inputContent}>
                        <Input
                            placeholder="CEP"
                            icon="map-marker"
                            keyboardType="numeric"
                            onChange={(txt) => { getAddress(txt) }}
                        />
                    </View>

                    <View style={[styles.inputContent, { opacity: 0.9 }]}>
                        <Input
                            placeholder="Preencha o CEP"
                            icon="map-marker"
                            value={addressComplete}
                            editable={false}
                        />
                    </View>

                    <View style={styles.inputContent}>
                        <Input
                            placeholder="Senha"
                            icon="lock"
                            secureTextEntry={true}
                            onChange={(txt) => { setPassword(txt) }}
                        />
                    </View>

                    <View style={styles.inputContent}>
                        <Input
                            placeholder="Confirmar senha"
                            icon="lock"
                            secureTextEntry={true}
                            onChange={(txt) => { setConfirmPassword(txt) }}
                        />
                    </View>

                    <TouchableOpacity style={styles.buttonRegisterContent} onPress={() => cadastrar()}>
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>

                <AwesomeAlert
                    contentStyle={{ width: 300 }}
                    show={showAlert}
                    showProgress={false}
                    title="Alerta"
                    message={messageAlert}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showConfirmButton={true}
                    confirmText="OK"
                    messageStyle={{ fontFamily: 'Poppins-Regular', textAlign: 'center', alignItems: 'center' }}

                    confirmButtonColor="#F55B6A"
                    onConfirmPressed={() => {
                        handlerHideAlert();
                    }}
                />

                <AwesomeAlert
                    show={showWait}
                    showProgress={true}
                    title="Aguarde..."
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                />
            </ImageBackground>
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#18181c'
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: Platform.OS == 'ios' ? 50 : 0
    },

    registerContent: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 50,
        height: 50
    },

    inputContent: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderRadius: 10,
        marginTop: 20,
        marginHorizontal: 20,
        paddingHorizontal: 20,
        color: '#fff'
    },

    input: {
        flex: 1,
        fontFamily: 'Poppins-Regular',
    },

    buttonRegisterContent: {
        height: 50,
        backgroundColor: '#F55B6A',
        width: '80%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },

    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Poppins-Regular'
    },

});
