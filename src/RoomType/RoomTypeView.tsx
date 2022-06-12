import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Text,
  List,
  IconButton,
  Subheading,
} from 'react-native-paper';
import { useCollection } from 'src/_realm';
import { Container } from 'src/components';
import { Styles } from 'src/Styles';

export function RoomTypeView({ navigation, route }: ScreenProps<'Room Types'>) {
  const RoomType = useCollection('RoomType');

  const RoomTypeRow = ({
    _id,
    name,
    beds_double,
    beds_king,
    beds_queen,
    beds_single,
    capacity,
    price_peak,
    price_offpeak,
  }: RoomType) => (
    <Card
      style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 10,
      }}
      onPress={() => navigation.navigate('New Room Type', { _id: String(_id) })}
      key={_id}>
      <View style={Styles.FRBC}>
        <Subheading>{name}</Subheading>
        <IconButton
          size={24}
          style={{ padding: 0, margin: 0 }}
          icon="trash-can"
          onPress={() => {
            Alert.alert(`Delete ${name}?`, undefined, [
              {
                text: 'Yes, delete it',
                style: 'destructive',
                onPress: () => RoomType.destroy(_id),
              },
              { text: 'Cancel', style: 'cancel' },
            ]);
          }}
        />
      </View>
      <View style={Styles.FRBC}>
        <View style={{ ...Styles.FRSC, width: '20%' }}>
          <List.Icon
            style={{ ...Style.icon, marginRight: -3 }}
            icon="bed-empty"
          />
          <Text>{beds_double + beds_king + beds_queen + beds_single}</Text>
        </View>
        <View style={{ ...Styles.FRSC, width: '20%' }}>
          <List.Icon style={Style.icon} icon="account" />
          <Text>{capacity}</Text>
        </View>
        <View style={{ ...Styles.FRSC, width: '20%' }}>
          <List.Icon style={Style.icon} icon="currency-usd" />
          <Text>{price_peak}</Text>
        </View>
        <View style={{ ...Styles.FRSC, width: '20%' }}>
          <List.Icon style={Style.icon} icon="currency-usd-off" />
          <Text>{price_offpeak}</Text>
        </View>
      </View>
    </Card>
  );

  return RoomType.busy ? (
    <Text>Loading...</Text>
  ) : (
    <Container
      body={
        <View style={Styles.viewWrapper}>
          <ScrollView>{RoomType.asc('price_peak').map(RoomTypeRow)}</ScrollView>
        </View>
      }
      footer={
        <Button
          mode="contained"
          icon="plus"
          onPress={() => navigation.navigate('New Room Type')}>
          Add New Room Type
        </Button>
      }
    />
  );
}

const Style = StyleSheet.create({
  icon: { padding: 0, margin: 0 },
});
