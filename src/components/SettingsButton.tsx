import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { IconButton } from 'react-native-paper';

export function SettingsButton() {
  const navigation = useNavigation();
  return (
    <IconButton icon="cog" onPress={() => navigation.navigate('Settings')} />
  );
}
