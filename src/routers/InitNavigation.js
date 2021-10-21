import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login'
import Onboarding from '../screens/Onboarding'
import Profile from '../screens/Profile'
import Register from '../screens/Register'
import Favorites from '../screens/Favorites';
import Details from '../screens/Details'

const Stack = createStackNavigator();

export default function InitNavigation() {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name="Onboarding" component={Onboarding} options={{ headerLeft: false, gestureEnabled: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerLeft: false, gestureEnabled: false }} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Details" component={Details} />
            <Stack.Screen name="Favorites" component={Favorites} />
        </Stack.Navigator>
    );
};
