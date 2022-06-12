import React from 'react';
import { View, Alert, ScrollView, StyleSheet } from 'react-native';
import {
  Card,
  IconButton,
  List,
  Text,
  Button,
  Subheading,
} from 'react-native-paper';
import { Container } from 'src/components';
import { Styles } from 'src/Styles';
import { useCollection } from 'src/_realm';

export function RoomView({ navigation }: ScreenProps<'Rooms'>) {
  const Room = useCollection('Room');

  const RoomRow = ({
    _id,
    number,
    roomType,
    petsAllowed,
    wheelchairAccessible,
  }: Room) => (
    <Card
      style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 10,
      }}
      onPress={() => {
        Room.close();
        navigation.navigate('New Room', { _id });
      }}
      key={_id}>
      <View style={Styles.FRBC}>
        <Subheading style={{ width: '50%' }}>
          {number + ' - ' + roomType.name}
        </Subheading>
        <View style={[Styles.FRCC, { width: '50%' }]}>
          <List.Icon
            color={wheelchairAccessible ? 'black' : '#ccc'}
            style={{ ...Style.icon, marginRight: -3 }}
            icon="wheelchair-accessibility"
          />
          <List.Icon
            color={petsAllowed ? 'black' : '#ccc'}
            style={{ ...Style.icon }}
            icon="paw"
          />
          <IconButton
            size={20}
            style={{ padding: 0, margin: 0, marginLeft: 50 }}
            icon="trash-can"
            onPress={() => {
              Alert.alert(
                `Delete Room ${number} - ${roomType.name}?`,
                undefined,
                [
                  {
                    text: 'Yes, delete it',
                    style: 'destructive',
                    onPress: () => Room.destroy(_id),
                  },
                  { text: 'Cancel', style: 'cancel' },
                ],
              );
            }}
          />
        </View>
      </View>
    </Card>
  );

  return Room.busy ? (
    <Text>Loading...</Text>
  ) : (
    <Container
      body={
        <View style={Styles.viewWrapper}>
          <ScrollView>{Room.asc('number').map(RoomRow)}</ScrollView>
        </View>
      }
      footer={
        <Button
          mode="contained"
          icon="plus"
          onPress={() => navigation.navigate('New Room')}>
          Add New Room
        </Button>
      }
    />
  );
}

const Style = StyleSheet.create({
  icon: { padding: 0, margin: 0, marginRight: -10 },
});
