import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Profile from '../screens/Profile'
import Details from '../screens/Details'

const Stack = createStackNavigator();

export default function InternNavigation() {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false, headerLeft: false, gestureEnabled: false }} >
            <Stack.Screen name="Profile" component={Profile} options={{ headerLeft: false, gestureEnabled: false }} />
            <Stack.Screen name="Details" component={Details} options={{ headerLeft: false, gestureEnabled: false }} />
        </Stack.Navigator>
    );
};
