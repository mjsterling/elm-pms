import React from 'react';
import { View, Text } from 'react-native';
import { IconButton, List } from 'react-native-paper';
import { Styles } from 'src/Styles';

export function Clicker({ fieldName, fields, setFields, icon, label }: Props) {
  return (
    <View style={{ ...Styles.FRBC, marginBottom: 10 }}>
      <List.Icon icon={icon} />
      <Text style={{ fontSize: 18, width: 120 }}>{label}</Text>
      <IconButton
        icon="minus"
        disabled={fields[fieldName] === 0}
        onPress={() =>
          setFields({
            ...fields,
            [fieldName]: (fields[fieldName] || 0) - 1,
          })
        }
      />
      <Text style={{ fontSize: 18 }}>{String(fields[fieldName])}</Text>
      <IconButton
        icon="plus"
        onPress={() =>
          setFields({
            ...fields,
            [fieldName]: (fields[fieldName] || 0) + 1,
          })
        }
      />
    </View>
  );
}

interface Props {
  fieldName: string;
  fields: { [key: string]: any };
  setFields(fields: { [key: string]: any }): void;
  icon: string;
  label: string;
}
