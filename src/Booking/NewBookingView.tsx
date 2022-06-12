import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  Button,
  Checkbox,
  List,
  Subheading,
  Text,
  TextInput,
} from 'react-native-paper';
import { Container } from 'src/components';
import { Clicker } from 'src/components/Clicker';
import { DatePicker } from 'src/components/DatePicker';
import { Styles } from 'src/Styles';
import { useCollection } from 'src/_realm';

export function NewBookingView({ route }: ScreenProps<'New Booking'>) {
  const Booking = useCollection('Booking');
  const [fields, setFields] = useState<Partial<Booking>>({
    contactEmail: '',
    contactFirstName: '',
    contactLastName: '',
    contactPhone: '',
    confirmed: false,
    numAdults: 0,
    numChildren: 0,
    pets: false,
    petDesc: '',
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 86.4e6),
  });
  useEffect(() => {
    if (route.params?._id) {
      const booking = Booking.find(route.params._id);
      if (booking) {
        const _booking: any = {};
        for (const key in booking) {
          _booking[key] = booking[key as keyof typeof booking];
        }
        setFields(_booking);
      }
    }
  }, [Booking.busy]);
  if (!fields) return <List.Icon icon="loading" />;

  const handleSubmit = () => {
    if (route.params?._id) {
      Booking.update(route.params._id, {
        ...fields,
      });
    } else {
      Booking.create(fields as New<Booking>);
    }
  };

  console.log(fields);

  return (
    <Container
      header={
        <View style={Styles.FCCC}>
          <Subheading>Dates</Subheading>
          <View style={Styles.FRBC}>
            <DatePicker
              value={fields.startDate!}
              setValue={value => {
                setFields({
                  ...fields,
                  startDate: new Date(value),
                  endDate:
                    (fields?.endDate || 0) <= (fields?.startDate || -1)
                      ? new Date(value.getTime() + 86.4e6)
                      : fields.endDate,
                });
              }}
              label="Start Date"
            />
            <DatePicker
              value={fields.endDate!}
              setValue={value =>
                setFields({ ...fields, endDate: new Date(value) })
              }
              label="End Date"
            />
          </View>
        </View>
      }
      body={
        <View style={Styles.FCCC}>
          <Subheading>Contact Details</Subheading>
          <View style={Styles.FRBC}>
            <TextInput
              dense
              mode="outlined"
              label="First Name"
              value={fields.contactFirstName}
              onChangeText={value =>
                setFields({ ...fields, contactFirstName: value })
              }
              style={Styles.textInputHalf}
            />
            <TextInput
              dense
              mode="outlined"
              label="Last Name"
              value={fields.contactLastName}
              onChangeText={value =>
                setFields({ ...fields, contactLastName: value })
              }
              style={Styles.textInputHalf}
            />
          </View>
          <TextInput
            dense
            mode="outlined"
            label="Email"
            value={fields.contactEmail}
            onChangeText={value =>
              setFields({ ...fields, contactEmail: value })
            }
            style={Styles.textInput}
          />

          <TextInput
            dense
            mode="outlined"
            label="Phone"
            value={fields.contactPhone}
            onChangeText={value =>
              setFields({
                ...fields,
                contactPhone: value.replace(/\D/gi, ''),
              })
            }
            style={Styles.textInput}
          />
          <Subheading style={{ marginTop: 20 }}>Guest Details</Subheading>
          <Clicker
            icon="account-multiple"
            label="Adults"
            fieldName="numAdults"
            {...{ fields, setFields }}
          />
          <Clicker
            icon="account-child"
            label="Children"
            fieldName="numChildren"
            {...{ fields, setFields }}
          />
          <View style={Styles.FRCC}>
            <Checkbox.Item
              mode="android"
              color="#000"
              label="Bringing pets?"
              labelStyle={{ paddingRight: 30 }}
              status={fields.pets ? 'checked' : 'unchecked'}
              onPress={() => setFields({ ...fields, pets: !fields.pets })}
            />
          </View>
          {fields.pets ? (
            <TextInput
              label="Pet Description"
              mode="outlined"
              multiline
              value={fields.petDesc}
              onChangeText={(value: string) =>
                setFields({ ...fields, petDesc: value })
              }
              style={{ width: '100%', height: 120 }}
            />
          ) : null}
        </View>
      }
      footer={
        <Button icon="floppy" onPress={handleSubmit} mode="contained">
          Save
        </Button>
      }
    />
  );
}
