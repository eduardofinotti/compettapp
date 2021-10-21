import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/FontAwesome';

import Home from '../screens/Home'
import Videos from '../screens/Videos'
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

function IconPrincipal(props) {
    return (
        <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F55B6A', borderRadius: 30, marginBottom: 20 }}>
            <Icon name={props.iconName} size={props.size} color='#fff' />
        </View>
    );
}

function IconDefault(props) {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Icon name={props.iconName} size={props.size} color={props.color} />
        </View>
    );
}

export default function MainNavigation() {

    return (
        <Tab.Navigator
            initialRouteName={'Home'}
            screenOptions={
                ({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        size = 25

                        if (route.name === 'Home') {
                            iconName = 'trophy';
                            return <IconPrincipal iconName={iconName} size={40} color={color} />
                        } else if (route.name === 'Vídeos') {
                            iconName = 'play-circle-o';
                            return <IconDefault iconName={iconName} size={size} color={color} />
                        } else if (route.name === 'Infos') {
                            iconName = 'info-circle';
                            return <IconDefault iconName={iconName} size={size} color={color} />
                        }
                    },
                    tabBarActiveTintColor: '#F55B6A',
                    tabBarInactiveTintColor: 'gray',
                })}

        >
            <Tab.Screen name="Vídeos"
                component={Videos}
                options={{ tabBarLabel: "Videos", tabBarLabelStyle: { marginBottom: 5 } }}
            />
            <Tab.Screen name="Home"
                component={Home}
                options={{ tabBarLabel: "" }}
            />
            <Tab.Screen name="Infos"
                component={Videos}
                options={{ tabBarLabel: "Infos", tabBarLabelStyle: { marginBottom: 5 } }}
            />
        </Tab.Navigator>
    );
};
