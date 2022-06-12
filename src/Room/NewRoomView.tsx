import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  Button,
  Checkbox,
  RadioButton,
  Subheading,
  Text,
  TextInput,
} from 'react-native-paper';
import { Combobox, Container } from 'src/components';
import { Styles } from 'src/Styles';
import { New, useCollection } from 'src/_realm';

export function NewRoomView({ navigation, route }: ScreenProps<'New Room'>) {
  const Room = useCollection('Room');
  const RoomType = useCollection('RoomType');
  const [fields, setFields] = useState<Partial<Room> & { roomType?: RoomType }>(
    {
      number: 0,
      petsAllowed: false,
      wheelchairAccessible: false,
    },
  );
  useEffect(() => {
    if (route.params?._id) {
      const room = Room.find(route.params._id);
      if (room) {
        const _room: any = {};
        for (const key in room) {
          _room[key] = room[key as keyof typeof room];
        }
        setFields(_room);
      }
    }
  }, [Room.busy]);
  const handleSubmit = () => {
    if (!fields.roomType) {
      console.warn('No room type selected');
      return;
    }
    if (route.params?._id) {
      Room.update(route.params._id, {
        ...fields,
        number: Number(fields.number),
      });
    } else {
      Room.create(fields as New<Room>);
    }
  };

  return Room.busy || RoomType.busy ? (
    <Text>Loading...</Text>
  ) : (
    <Container
      body={
        <View style={{ ...Styles.FCSC, flex: 1 }}>
          <TextInput
            mode="outlined"
            value={String(fields.number)}
            onChangeText={value =>
              setFields({ ...fields, number: Number(value) })
            }
            label="Room #"
            style={{ ...Styles.textInput, width: 250 }}
          />
          <View
            style={{
              ...Styles.FRCC,

              flexWrap: 'wrap',
              marginBottom: 20,
            }}>
            <Subheading style={{ width: '100%', textAlign: 'center' }}>
              Select Room Type
            </Subheading>
            {RoomType.all.map(rt => (
              <Button
                key={`roomTypeButton${rt._id}`}
                mode={
                  `${fields.roomType?._id}` === `${rt._id}`
                    ? 'outlined'
                    : 'text'
                }
                onPress={() => setFields({ ...fields, roomType: rt })}
                style={{ borderColor: '#0504aa' }}>
                {rt.name}
              </Button>
            ))}
          </View>
          <Checkbox.Item
            style={{ ...Styles.FRBC, width: 250 }}
            mode="android"
            label="Pets Allowed"
            color="#0504aa"
            onPress={() =>
              setFields({ ...fields, petsAllowed: !fields.petsAllowed })
            }
            status={fields.petsAllowed ? 'checked' : 'unchecked'}
          />
          <Checkbox.Item
            style={{ ...Styles.FRBC, width: 250 }}
            mode="android"
            label="Wheelchair Access"
            color="#0504aa"
            onPress={() =>
              setFields({
                ...fields,
                wheelchairAccessible: !fields.wheelchairAccessible,
              })
            }
            status={fields.wheelchairAccessible ? 'checked' : 'unchecked'}
          />
        </View>
      }
      footer={
        <Button mode="contained" icon="floppy" onPress={handleSubmit}>
          Save
        </Button>
      }
    />
  );
}
