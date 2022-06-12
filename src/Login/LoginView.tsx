import React, { useEffect, useState } from 'react';
import Realm, {
  DefaultFunctionsFactory,
  DefaultUserProfileData,
  User,
} from 'realm';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackScreenProps } from '@react-navigation/stack';
import { realmApp } from '../_realm';
import { Button, IconButton, TextInput } from 'react-native-paper';
import { Container } from 'src/components';

Icon.loadFont();

export function LoginView({
  navigation,
  route,
}: StackScreenProps<RootNavigatorParams, 'Login'>) {
  const [email, setEmail] = useState('mjsterling93@gmail.com');
  const [password, setPassword] = useState('test123');
  const [user, setUser] = useState<User<
    DefaultFunctionsFactory,
    any,
    DefaultUserProfileData
  > | null>(null);

  // state values for toggable visibility of features in the UI
  const [passwordHidden, setPasswordHidden] = useState(true);

  useEffect(() => {
    if (user) {
      navigation.navigate('Home'); // if there is a logged in user, navigate to the Tasks Screen
    }
  }, [user, navigation]);

  const signIn = async (email: string, password: string) => {
    const creds = Realm.Credentials.emailPassword(email, password);
    const loggedInUser = await realmApp.logIn(creds);
    setUser(loggedInUser);
  };
  // onPressSignIn() uses the emailPassword authentication provider to log in
  const onPressSignIn = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      if (
        typeof error === 'object' &&
        (error as { message: string }).hasOwnProperty('message')
      ) {
        Alert.alert(
          `Failed to sign in: ${(error as { message: string }).message}`,
        );
      }
    }
  };

  return (
    <Container
      body={
        <>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={passwordHidden}
            right={
              <TextInput.Icon
                name={passwordHidden ? 'eye-off' : 'eye'}
                color="black"
                onPress={() => setPasswordHidden(!passwordHidden)}
              />
            }
          />
        </>
      }
      footer={
        <Button mode="contained" onPress={onPressSignIn} icon="login">
          Log In
        </Button>
      }
    />
  );
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
  },
  mainButton: {
    width: 350,
  },
});
