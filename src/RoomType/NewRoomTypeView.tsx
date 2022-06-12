import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Avatar,
  Button,
  IconButton,
  List,
  Text,
  TextInput,
} from 'react-native-paper';
import { Container } from 'src/components';
import { Styles } from 'src/Styles';
import { New, useCollection } from 'src/_realm';
import { Clicker } from 'src/components/Clicker';

export function NewRoomTypeView({
  navigation,
  route,
}: ScreenProps<'New Room Type'>) {
  const RoomType = useCollection('RoomType');
  const [fields, setFields] = useState<New<RoomType>>({
    name: '',
    beds_king: 0,
    beds_queen: 0,
    beds_double: 0,
    beds_single: 0,
    price_peak: 0,
    price_offpeak: 0,
    capacity: 0,
    rooms: [],
  });
  useEffect(() => {
    if (route.params?._id) {
      const roomType = RoomType.find(route.params._id);
      if (roomType) {
        const _roomType: any = {};
        for (const key in roomType) {
          _roomType[key] = roomType[key as keyof typeof roomType];
        }
        setFields(_roomType);
      }
    }
  }, [RoomType.busy]);

  const handleSubmit = () => {
    if (route.params?._id) {
      RoomType.update(route.params?._id, fields);
    } else {
      RoomType.create({
        ...fields,
        capacity:
          fields.beds_single +
          (fields.beds_double + fields.beds_queen + fields.beds_king) * 2,
      });
    }
    navigation.goBack();
  };
  return (
    <Container
      body={
        <View style={Styles.FCCC}>
          <TextInput
            mode="outlined"
            value={fields.name}
            onChangeText={value => setFields({ ...fields, name: value })}
            label="Room Type Name"
            style={Styles.textInput}
          />
          <View style={{ ...Styles.FRBC, width: '100%' }}>
            <View style={{ width: '48%', paddingRight: 5 }}>
              <TextInput
                mode="outlined"
                value={String(fields.price_peak)}
                onChangeText={value =>
                  setFields({ ...fields, price_peak: Number(value) })
                }
                label="Price (peak)"
                style={Styles.textInput}
                left={<TextInput.Affix text="$" />}
              />
            </View>
            <View style={{ width: '48%', paddingLeft: 5 }}>
              <TextInput
                mode="outlined"
                value={String(fields.price_offpeak)}
                onChangeText={value =>
                  setFields({ ...fields, price_offpeak: Number(value) })
                }
                label="Price (off peak)"
                style={Styles.textInput}
                left={<TextInput.Affix text="$" />}
              />
            </View>
          </View>
          <TextInput
            multiline
            mode="outlined"
            value={fields.description}
            onChangeText={value => setFields({ ...fields, description: value })}
            label="Description"
            style={Styles.textInput}
          />
          <Clicker
            {...{ fields, setFields }}
            icon="bed-empty"
            fieldName="beds_king"
            label="King Beds"
          />
          <Clicker
            {...{ fields, setFields }}
            icon="bed-empty"
            fieldName="beds_queen"
            label="Queen Beds"
          />
          <Clicker
            {...{ fields, setFields }}
            icon="bed-empty"
            fieldName="beds_double"
            label="Double Beds"
          />
          <Clicker
            {...{ fields, setFields }}
            icon="bed-empty"
            fieldName="beds_single"
            label="Single Beds"
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
