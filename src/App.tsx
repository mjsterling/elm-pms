import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { createStackNavigator } from '@react-navigation/stack';
import { LogoutButton, SettingsButton } from './components';
import { LoginView } from './Login';
import { SettingsView } from './Settings';
import { HomeView } from 'src/Home';
import { NewRoomTypeView, RoomTypeView } from './RoomType';
import { NewRoomView, RoomView } from './Room';
import { NewBookingView } from './Booking';

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0504aa',
  },
};

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginView} />
            <Stack.Screen
              name="Home"
              component={HomeView}
              options={{
                headerLeft: () => <LogoutButton />,
                headerRight: () => <SettingsButton />,
              }}
            />
            <Stack.Screen name="New Booking" component={NewBookingView} />
            <Stack.Screen name="New Room" component={NewRoomView} />
            <Stack.Screen name="New Room Type" component={NewRoomTypeView} />
            <Stack.Screen name="Rooms" component={RoomView} />
            <Stack.Screen name="Room Types" component={RoomTypeView} />
            <Stack.Screen name="Settings" component={SettingsView} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export type RootNavigatorParams = {
  Home: undefined;
  Login: undefined;
  'New Booking': { _id: string } | undefined;
  'New Room': { _id: string } | undefined;
  'New Room Type': { _id: string } | undefined;
  Settings: undefined;
  Rooms: undefined;
  'Room Types': undefined;
};

const styles = StyleSheet.create({});

export default App;
