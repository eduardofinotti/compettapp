import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import InitNavigation from './src/routers/InitNavigation';
import MainNavigation from './src/routers/MainNavigation';
import InternNavigation from './src/routers/InternNavigation';

import { UserProvider } from './src/context/Context'
import { StatusBar } from 'react-native';

import { InAppNotificationProvider } from 'react-native-in-app-notification';

export default function App() {

  const Stack = createStackNavigator();

  return (
    <InAppNotificationProvider>
      <UserProvider>
        <StatusBar backgroundColor="#18181c" barStyle="light-content" />
        <NavigationContainer >
          <Stack.Navigator screenOptions={{ headerShown: false, headerLeft: false, gestureEnabled: false }} >
            <Stack.Screen name="InitNavigation" component={InitNavigation} />
            <Stack.Screen name="MainNavigation" component={MainNavigation} />
            <Stack.Screen name="InternNavigation" component={InternNavigation} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </InAppNotificationProvider>

  );
};
