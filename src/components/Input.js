import React, { useState } from 'react';
import { StyleSheet, } from 'react-native';
import { TextInput } from 'react-native-paper';

export default function Input(props) {

    const [value, setValue] = useState('')

    function onChangeValue(value) {
        setValue(value)
        props.onChange(value)
    }

    return (
        <TextInput style={styles.input}
            editable={props.editable}
            onFocus={() => { props.onFocus ? props.onFocus() : '' }}
            onBlur={() => { props.onFocus ? props.onBlur() : '' }}
            secureTextEntry={props.secureTextEntry}
            outlineColor="#fff"
            returnKeyType={"next"}
            keyboardType={props.keyboardType ? props.keyboardType : "default"}
            autoCapitalize={props.autoCapitalize ? props.autoCapitalize : "none"}
            underlineColor="#fff"
            placeholder={props.placeholder}
            value={props.value ? props.value : value}
            onChangeText={text => {
                onChangeValue(text);
            }}
            left={<TextInput.Icon size={20} name={props.icon} color="#fff" />}
            theme={{ colors: { text: '#fff', placeholder: '#a4a4a4', primary: '#fff' } }}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        flex: 1,
        fontFamily: 'Poppins-Regular',
        backgroundColor: 'transparent',
        color: '#fff',
        fontSize: 13
    },
});
