import * as React from 'react';
import { Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { realmApp } from '../_realm/RealmApp';
import { IconButton } from 'react-native-paper';

export function LogoutButton() {
  const navigation = useNavigation();
  const user = realmApp.currentUser;

  // The signOut function calls the logOut function on the currently
  // logged in user and then navigates to the welcome screen
  const signOut = () => {
    if (user) {
      user.logOut();
    }
    navigation.navigate('Login');
  };

  return (
    <IconButton
      icon="logout"
      onPress={() => {
        Alert.alert('Log Out', undefined, [
          {
            text: 'Yes, Log Out',
            style: 'destructive',
            onPress: () => signOut(),
          },
          { text: 'Cancel', style: 'cancel' },
        ]);
      }}
    />
  );
}
