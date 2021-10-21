import React from 'react';
import {
    Image,
    ImageProps,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker'
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';

export const Avatar = (props) => {
    const [uri, setUri] = React.useState(props.source?.uri || undefined);
    const [visible, setVisible] = React.useState(false);

    const close = () => setVisible(false);
    const open = () => setVisible(true);

    const chooseImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        })
            .then(image => {
                setUri(image.path);
                props.onChange?.(image);
            })
            .finally(close);
    };

    const openCamera = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        })
            .then(image => {
                setUri(image.path);
                props.onChange?.(image);

            })
            .finally(close);
    };

    return (
        <>
            <TouchableOpacity onPress={open} >
                <Image style={styles.avatar}
                    {...props}
                    source={uri ? { uri } : props.source}
                />


                <Icon name="camera" size={20} color="#fff"
                    style={{ marginTop: -20 }}
                />

            </TouchableOpacity>
            <Modal
                isVisible={visible}
                onBackButtonPress={close}
                onBackdropPress={close}
                style={{ justifyContent: 'flex-end', margin: 0 }}>
                <SafeAreaView style={styles.options}>
                    <TouchableOpacity style={styles.option} onPress={chooseImage}>
                        <Icon name="image" size={25} color="#F55B6A" />
                        <Text style={styles.optionText}>Bliblioteca</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option} onPress={openCamera}>
                        <Icon name="camera" size={25} color="#F55B6A" />
                        <Text style={styles.optionText}>Câmera</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    avatar: {
        paddingTop: 20,
        height: 100,
        width: 100,
        borderRadius: 100,
        padding: 20,
    },

    options: {
        backgroundColor: 'white',
        flexDirection: 'row',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    option: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    optionText: {
        color: '#F55B6A',
        fontSize: 14,
        fontFamily: 'Poppins-Bold'
    },

});
