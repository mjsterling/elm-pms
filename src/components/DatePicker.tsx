import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {
  Portal,
  Dialog,
  Button,
  IconButton,
  TextInput,
} from 'react-native-paper';
import { Styles } from 'src/Styles';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function DatePicker({
  value,
  setValue,
  label,
  error = false,
  width = '48%',
}: Props) {
  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    day: new Date().getDate(),
  });
  const [open, setOpen] = useState(false);

  const TableRows = () => {
    const { year, month, day } = date;

    const elements = [];
    const tempRow = new Array(new Date(year, month, 1).getDay()).fill(
      <View style={Style.cell}></View>,
    );
    const numDays = daysInMonth(month, year);

    for (let i = 1; i <= numDays; i++) {
      tempRow.push(
        <View style={Style.cell}>
          <TouchableOpacity
            onPress={() => {
              setDate({ ...date, day: i });
            }}>
            <Text
              style={{
                ...Style.cellText,
                color: day === i ? 'blue' : 'black',
                fontWeight: day === i ? 'bold' : 'normal',
              }}>
              {i}
            </Text>
          </TouchableOpacity>
        </View>,
      );
      if (tempRow.length > 6) {
        elements.push(
          <View style={Style.row}>{[...tempRow.splice(0, 7)]}</View>,
        );
      }
    }
    if (tempRow.length) {
      elements.push(
        <View style={Style.row}>
          {[
            ...tempRow,
            ...new Array(7 - tempRow.length).fill(
              <View style={Style.cell}></View>,
            ),
          ]}
        </View>,
      );
    }

    return <View style={{ height: 300 }}>{elements}</View>;
  };

  const HeaderCell = (d: string, i: number) => (
    <View style={Style.cell} key={`headerCell${d}${i}`}>
      <Text style={Style.headerText}>{d}</Text>
    </View>
  );
  const TableHeader = () => (
    <View style={Style.row}>{days.map(HeaderCell)}</View>
  );

  const { year, month, day } = date;

  const saveAndClose = () => {
    setValue(new Date(year, month, day, 0, 0, 0));
    setOpen(false);
  };

  const prevMonth = (
    value: { year: number; month: number; day: number },
    setValue: (value: { year: number; month: number; day: number }) => void,
  ) => {
    const newValue = { ...value };
    if (value.month === 0) {
      newValue.month = 11;
      newValue.year -= 1;
    } else {
      newValue.month -= 1;
    }
    setValue(newValue);
  };

  const nextMonth = (
    value: { year: number; month: number; day: number },
    setValue: (value: { year: number; month: number; day: number }) => void,
  ) => {
    const newValue = { ...value };
    if (value.month === 11) {
      newValue.year += 1;
      newValue.month = 0;
    } else {
      newValue.month += 1;
    }
    setValue(newValue);
  };

  const startOfMonth = (date: Date) => {
    if (!date) {
      return 0;
    }
    const startDate = new Date(date);
    startDate.setDate(1);
    return startDate.getDay();
  };

  const daysInMonth = (month: number, year: number) =>
    [31, year % 4 ? 28 : 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];

  return (
    <View style={{ width }}>
      <TextInput
        mode="outlined"
        dense
        value={value?.toLocaleDateString('en-GB') || ''}
        disabled
        error={error}
        label={label || ''}
        style={{
          width: '100%',
        }}
        right={
          <TextInput.Icon name={'calendar'} onPress={() => setOpen(true)} />
        }
      />
      {open && (
        <Portal>
          <Dialog
            visible
            style={{
              backgroundColor: '#f7f7f7',
              borderRadius: 15,
              margin: 0,
              padding: 0,
            }}
            onDismiss={() => setOpen(false)}>
            <Dialog.Title style={{ textAlign: 'center' }}>
              Select Date
            </Dialog.Title>
            <Dialog.Content>
              <View>
                <View style={{ ...Styles.FRCC }}>
                  <IconButton
                    icon="chevron-left"
                    onPress={() => prevMonth(date, setDate)}
                  />
                  <Text
                    style={{
                      ...Style.headerText,
                      textAlign: 'center',
                      width: 140,
                    }}>
                    {months[month]} {year}
                  </Text>
                  <IconButton
                    icon="chevron-right"
                    onPress={() => nextMonth(date, setDate)}
                  />
                </View>
                <TableHeader />
                <TableRows />
              </View>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                mode="contained"
                style={Style.button}
                onPress={saveAndClose}>
                OK
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
    </View>
  );
}

const Style = StyleSheet.create({
  display: {
    ...Styles.FRCC,
    justifyContent: 'space-between',
    height: 40,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  displayText: {
    height: 40,
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#777',
    width: 165,
    marginTop: -5,
  },
  cell: {
    ...Styles.FRCC,
    height: 60,
    width: 42,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cellText: {
    fontSize: 16,
  },
  button: {
    marginRight: 25,
  },
  row: {
    ...Styles.FRBC,
    height: 50,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});

interface Props {
  value: Date | null;
  setValue(date: Date): void;
  label?: string;
  error?: boolean;
  width?: string | number;
}
