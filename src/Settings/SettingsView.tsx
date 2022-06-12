import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Subheading } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Container } from 'src/components';
import { Styles } from 'src/Styles';

export function SettingsView({ navigation }: ScreenProps<'Settings'>) {
  return (
    <Container
      body={
        <View
          style={{
            ...Styles.FCCC,
            width: '60%',
            left: '20%',
          }}>
          <Subheading>Hotel Setup</Subheading>
          <Button
            mode="outlined"
            icon="office-building"
            style={Style.button}
            onPress={() => navigation.navigate('Room Types')}>
            Room Types
          </Button>
          <Button
            mode="outlined"
            icon="office-building"
            style={Style.button}
            onPress={() => navigation.navigate('Rooms')}>
            Rooms
          </Button>
        </View>
      }
    />
  );
}

const Style = StyleSheet.create({
  button: {
    marginVertical: 10,
    width: 200,
  },
});
