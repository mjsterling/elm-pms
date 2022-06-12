import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { Styles } from '../Styles';

export function Container({ header, body, footer }: Props) {
  return (
    <View style={Styles.viewWrapper}>
      <View style={{ ...Styles.header, ...Styles.FRCC }}>{header}</View>
      <View style={Styles.body}>{body}</View>
      <View style={{ ...Styles.footer, ...Styles.FRCC }}>{footer}</View>
    </View>
  );
}

interface Props {
  header?: React.ReactNode;
  body: React.ReactNode;
  footer?: React.ReactNode;
}
