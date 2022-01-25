import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, ImageBackground, TouchableOpacity, Image, Animated, Keyboard, StatusBar } from 'react-native';
import Input from '../../components/Input';
import AwesomeAlert from 'react-native-awesome-alerts';

import { Avatar } from '../../components/Avatar';
import storage from '@react-native-firebase/storage';

import ImgToBase64 from 'react-native-image-base64';
const { base64encode, base64decode } = require('nodejs-base64');

var isValidEmail = require("email-validator");
import address from 'cep-promise'
import isValidCep from '@brazilian-utils/is-valid-cep';
const baseUrl = require('../../api/apiConfigDevelop').baseUrl();

import axios from 'axios';

import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../../context/Context';
import { SafeAreaView } from 'react-native-safe-area-context';

const image_background = require('../../assets/images/belt.png')
const logo = require('../../assets/images/logo-mini-w.png')
const avatar_logo = require('../../assets/images/avatar-kimono.png')

export default function Register({ navigation }, props) {

    const { user, setUser } = useContext(UserContext)

    const [avatarPath, setAvatarPath] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    const [isNewAvatar, setIsNewAvatar] = useState(false);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [cep, setCep] = useState(user.address.cep);
    const [addressComplete, setAddresComplete] = useState(`${user.address.city} - ${user.address.state}`);
    const [password, setPassword] = useState(user.password);
    const [confirmPassword, setConfirmPassword] = useState(user.password);

    const [showHeader, setShowHeader] = useState(true);
    const [showWait, setShowWait] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');

    async function salvar() {
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

        getAddress(cep)

        setShowWait(true)

        if (isNewAvatar == true) {
            setAvatarUrl(uploadAvatar())
        }

        await axios.put(`${baseUrl}/users/logged`, {
            email: email,
            name: name,
            password: password,
            profile_photo: avatarUrl,
            address:
            {
                cep: cep,
                city: city,
                state: state
            },
            id_user_type: "competitor",
        }, {
            headers: {
                "x-access-token": user.token,
                "Content-Type": "application/json"
            }
        })
            .then(async function (response) {
                setUser(response.data)

                console.log('--------------------------')
                console.log(response.data)
                console.log('--------------------------')

            })
            .catch(function (error) {
                handlerShowAlert('Erro ao atualizar cadastro. Verifique e tente novamente.')
                console.log(error);
            });
        setShowWait(false)
    }

    function handlerShowAlert(message) {
        setMessageAlert(message)
        setShowAlert(true)
    };

    function handlerHideAlert() {
        setShowAlert(false)
    };

    function backToHome() {
        navigation.navigate('MainNavigation')
    }

    async function uploadAvatar() {
        const stringRef = new Date().toString()
        const reference = await storage().ref(stringRef);
        await reference.putFile(avatarPath);
        const url = await storage().ref(stringRef).getDownloadURL();
        return url
    }

    function onAvatarChange(image) {
        setAvatarPath(image.path)
        setIsNewAvatar(true)
    }

    useEffect(async () => {
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

    async function getAddress(cep) {
        setCep(cep)

        if (await isValidCep(cep)) {
            await address(cep)
                .then(async result => {
                    setAddresComplete(`${result.city} - ${result.state}`)
                    setCity(result.city)
                    setState(result.state)

                    console.log(addressComplete)
                })
                .catch(() => {
                    setAddresComplete('')
                })
        } else {
            setAddresComplete('')
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#18181c', alignItems: 'center' }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={"height"}
            >

                <ImageBackground source={image_background} resizeMode="cover" imageStyle={{ opacity: 0.03, marginRight: -200 }} style={{ flex: 1 }}>

                    {showHeader &&
                        <View style={[styles.headerContent]}>
                            <TouchableOpacity onPress={() => backToHome()} >
                                <Icon name="long-arrow-left" size={40} color="#fff" />
                            </TouchableOpacity>
                            <Image source={logo} style={styles.logo} resizeMode="contain" />
                        </View>
                    }
                    <View style={styles.registerContent}>
                        <Avatar
                            onChange={onAvatarChange}
                            source={user.profile_photo ? { uri: user.profile_photo } : avatar_logo}
                        />
                        <View style={styles.inputContent}>
                            <Input
                                placeholder="Nome completo"
                                icon="account"
                                onChange={(txt) => {
                                    setName(txt)
                                    setShowHeader(false)
                                }}
                                value={name}
                            />
                        </View>

                        <View style={styles.inputContent}>
                            <Input
                                placeholder="E-mail"
                                icon="email"
                                onChange={(txt) => {
                                    setEmail(txt)
                                    setShowHeader(false)
                                }}
                                value={email}
                            />
                        </View>

                        <View style={styles.inputContent}>
                            <Input
                                placeholder="CEP"
                                icon="map-marker"
                                keyboardType="numeric"
                                onChange={(txt) => { getAddress(txt) }}
                                value={cep}
                            />
                        </View>

                        <View style={[styles.inputContent, { opacity: 0.9 }]}>
                            <Input
                                placeholder="Preencha o CEP"
                                icon="map-marker"
                                onChange={(txt) => { setAddresComplete(txt) }}
                                editable={false}
                                value={addressComplete}
                            />
                        </View>

                        <View style={styles.inputContent}>
                            <Input
                                placeholder="Senha"
                                icon="lock"
                                secureTextEntry={true}
                                onChange={(txt) => { setPassword(txt) }}
                                value={password}
                            />
                        </View>

                        <View style={styles.inputContent}>
                            <Input
                                placeholder="Confirmar senha"
                                icon="lock"
                                secureTextEntry={true}
                                onChange={(txt) => { setConfirmPassword(txt) }}
                                value={confirmPassword}
                            />
                        </View>

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
                        confirmButtonColor="#F55B6A"
                        onCancelPressed={() => {
                            handlerHideAlert();
                        }}
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

            </KeyboardAvoidingView>

            <TouchableOpacity style={styles.buttonRegisterContent} onPress={() => salvar()}>
                <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#18181c',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: -60,
    },
    logo: {
        width: 50,
        height: 50
    },
    registerContent: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
        marginBottom: 30
    },

    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Poppins-Regular'
    },

});