import React, { useRef, useState } from 'react'
import { Animated, StyleSheet, View, Platform, FlatList, Text, TextInput } from 'react-native'

function HeaderAnimated(props) {

    const moveCalc = useRef(new Animated.Value(0)).current

    const orHeightView = props.height ? props.height : 150

    let heightView = moveCalc.interpolate({
        inputRange: [0, orHeightView],
        outputRange: [orHeightView, 10],
        extrapolate: 'clamp'
    });

    let heightImage = moveCalc.interpolate({
        inputRange: [0, orHeightView],
        outputRange: [50, 50],
        extrapolate: 'clamp'
    });

    let opacityView = moveCalc.interpolate({
        inputRange: [props.from, props.to],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    function changePage() {
        props.changePage()
    }

    return (
        <View style={{ flex: 1, }}>
            <Animated.View style={[styles.header, { height: heightView }]}>
                <Animated.View style={{ justifyContent: 'center', opacity: opacityView, width: '100%', paddingHorizontal: 20, marginTop: 30 }} >
                    {props.children}
                </Animated.View>

            </Animated.View>

            <FlatList
                {...props}
                onEndReachedThreshold={0}
                onEndReached={changePage}
                onScroll={
                    Animated.event([
                        {
                            nativeEvent: {
                                contentOffset: {
                                    y: moveCalc
                                }
                            }
                        }],
                        { useNativeDriver: false }
                    )
                }
            // scrollEventThrottle={1}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
    },
})

export default HeaderAnimated
