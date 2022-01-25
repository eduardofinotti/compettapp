import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, TouchableOpacity, Text, ImageBackground } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

import { UserContext } from '../../context/Context';

const axios = require('axios');
const baseUrl = require('../../api/apiConfigDevelop').baseUrl();

import Input from '../../components/Input';
import AsyncStorage from '@react-native-community/async-storage';
const logo = require('../../assets/images/logo.png')
const google = require('../../assets/images/google-icon.png')
const image_background = require('../../assets/images/belt.png')

import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { WEB_CLIENT_ID } from '../../utils/keys';
import Divider from '../../components/Divider';

export default function Login({ navigation }) {

    const { user, setUser } = useContext(UserContext)

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [showAlert, setShowAlert] = useState(false);
    const [loginError, setLoginError] = useState(false);

    const [userInfo, setUserInfo] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: WEB_CLIENT_ID,
            offlineAccess: false
        });
    }, [])

    useEffect(() => {
        setLoginError(false)
    }, [])

    async function loginGoogle() {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setUserInfo(userInfo);

            console.log(userInfo)

            setError(null);
            setIsLoggedIn(true);

            navigation.navigate('Register', { userInfo })

        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // when user cancels sign in process,
                alert('Process Cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // when in progress already
                alert('Process in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // when play services not available
                alert('Play services are not available');
            } else {
                // some other error
                alert('Something else went wrong... ', error.toString());
                console.log(error.toString())
                setError(error);
            }
        }
    }

    async function signOut() {
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            setIsLoggedIn(false);
        } catch (error) {
            alert('Something else went wrong... ', error.toString());
        }
    }

    async function getCurrentUserInfo() {
        try {
            const userInfo = await GoogleSignin.signInSilently();
            setUserInfo(userInfo);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_REQUIRED) {
                // when user hasn't signed in yet
                alert('Please Sign in');
                setIsLoggedIn(false);
            } else {
                alert('Something else went wrong... ', error.toString());
                setIsLoggedIn(false);
            }
        }
    }

    async function login() {
        setShowAlert(true)
        await axios.post(`${baseUrl}/login`, {
            email: email,
            password: senha
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
                setLoginError(true)
                console.log(error);
            });
        setShowAlert(false)
    }

    async function enterVisit() {
        setUser({ user: null })
        navigation.navigate('MainNavigation')
    }

    function goToRegister() {
        navigation.navigate('Register', { userInfo })
    }

    return (
        <ImageBackground source={image_background} resizeMode="cover" imageStyle={{ opacity: 0.03, marginRight: -200 }} style={{
            flex: 1, justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#18181c'
        }}>
            <KeyboardAvoidingView style={styles.container} behavior={"height"}>
                <View style={styles.loginContent}>
                    <Image source={logo} style={styles.logo} resizeMode="contain" />

                    <View style={styles.inputContent}>
                        <Input
                            placeholder="E-mail"
                            icon="email"
                            onChange={(txt) => { setEmail(txt) }} />
                    </View>

                    <View style={styles.inputContent}>
                        <Input
                            placeholder="Senha"
                            icon="lock"
                            secureTextEntry={true}
                            onChange={(txt) => { setSenha(txt) }} />
                    </View>

                    {loginError &&
                        <Text style={styles.errorText}>Erro ao realizar login. Tente novamente.</Text>
                    }

                    <TouchableOpacity style={styles.buttonEnterContent} onPress={() => login()}>
                        <Text style={styles.buttonEnterText}>Entrar</Text>
                    </TouchableOpacity>

                    <Divider text={'ou'} widthEachLine={'45%'} />

                    <TouchableOpacity style={styles.buttonEnterGoogleContent} onPress={() => loginGoogle()}>
                        <Image source={google} style={styles.googleIcon} />
                        <Text style={styles.buttonEnterGoogleText}>Entrar com Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cadastrarContent} onPress={() => goToRegister()}>
                        <Text style={styles.cadastrarText}>Não tenho cadastro</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>

            <TouchableOpacity style={styles.buttonVisitContent} onPress={() => enterVisit()}>
                <Text style={styles.buttonVisitText}>Entar como visitante</Text>
            </TouchableOpacity>

            <AwesomeAlert
                show={showAlert}
                showProgress={true}
                title="Aguarde..."
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
            />
        </ImageBackground>
    );
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        width: '100%'
    },

    loginContent: {
        marginTop: 20,
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 220,
        marginVertical: 30
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
        backgroundColor: '#18181c',
        color: '#fff'
    },

    iconStyle: {
        marginRight: 10,
        opacity: 0.4
    },

    errorText: {
        color: '#F55B6A',
        fontFamily: 'Poppins-Regular',
        fontSize: 12,
        marginTop: 10
    },

    forgotPasswordContent: {
        width: '100%',
        alignItems: 'flex-end',
        paddingVertical: 20,
        paddingHorizontal: 40,
    },

    forgotPasswordText: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Poppins-Regular'
    },

    buttonEnterText: {
        color: '#F55B6A',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },

    buttonEnterContent: {
        height: 45,
        backgroundColor: '#fff',
        width: '80%',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },

    buttonEnterGoogleText: {
        color: '#4285F4',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        paddingHorizontal: 10
    },

    buttonEnterGoogleContent: {
        height: 45,
        backgroundColor: '#fff',
        width: '80%',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },

    googleIcon: {
        width: 20,
        height: 20
    },

    buttonVisitContent: {
        height: 50,
        width: '80%',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40
    },

    buttonVisitText: {
        color: '#F55B6A',
        fontSize: 16,
        fontFamily: 'Poppins-Regular'
    },

    cadastrarContent: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 40,
    },

    cadastrarText: {
        color: '#fff',
        fontFamily: 'Poppins-Regular',
        fontSize: 15
    },
});

