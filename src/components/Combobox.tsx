import React, { useEffect, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { Menu, TextInput } from 'react-native-paper';

/** Custom dropdown component
 * - @prop `allowCustomValue?: boolean` - allow custom values? If true, acts as textinput with suggestions. If false, acts as dropdown with search.
 * - @prop `error?: boolean` - whether to display the error style for the component
 * - @prop `height?: number | string` - default 52
 * - @prop `initialValue: string` - initial value of the selection
 * - @prop `label?: string` - label text
 * - @prop `options: string[]` - list of options to select from
 * - @prop `placeholder?: string` - placeholder text
 * - @prop `setValue: (value: string) => void` - setState function to be called when value changes
 * - @prop `style?: TextInputStyle object`
 * - @prop `width?: number | string` - default 600
 */
export function Combobox({
  options,
  error = false,
  initialValue,
  setValue,
  label = '',
  placeholder = '',
  width = 300,
  height = 56,
  style = {},
  allowCustomValue = false,
  overrideValue,
}: Props) {
  const [query, setQuery] = useState(initialValue || '');
  const [visible, setVisible] = useState(false);
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const reset = () => {
    setQuery('');
    setValue('');
    setVisible(false);
  };
  const byQuery = (string: string) => RegExp(query, 'gi').test(string);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    //console.log("fresh")
    if (overrideValue && overrideValue !== query) {
      setQuery(overrideValue);
    }
    if (query.length === 0) {
      setMenuOpen(true);
    }

    if (options.filter(byQuery).length === 0) {
      setMenuOpen(false);
    } else {
      const isVisible =
        visible || (query.length > 0 && !options.includes(query));
      setMenuOpen(isVisible);
    }
  }, [query, visible, overrideValue]);

  const MenuItem = (option: string, i: number) => {
    const onPress = (option: string) => {
      setQuery(option);
      setValue(option);
      setVisible(false);
    };
    return (
      <TouchableOpacity
        style={{
          ...Style.menuItem,
          width,
        }}
        key={`menuItem${i}`}
        onPress={() => onPress(option)}>
        <Text style={Style.menuTitle}>{option}</Text>
      </TouchableOpacity>
    );
  };

  const AffixStyle = {
    height: Math.floor(height * 0.8),
    width: Math.floor(height * 0.8),
    marginTop: Math.floor(height * 0.3),
  };

  return (
    <Menu
      visible={visible}
      style={{ marginTop: 30, width, height }}
      contentStyle={{ ...Style.menu }}
      onDismiss={close}
      anchor={
        <TextInput
          mode="outlined"
          value={query}
          error={error}
          onChangeText={text => {
            setQuery(text);
            if (allowCustomValue) setValue(text);
            else if (text.length) setVisible(true);
          }}
          label={label || undefined}
          placeholder={placeholder || undefined}
          style={{ width, height, marginTop: -10, ...style }}
          right={
            options.includes(query) ? (
              <TextInput.Icon style={AffixStyle} name="close" onPress={reset} />
            ) : visible ? (
              <TextInput.Icon
                style={AffixStyle}
                name="chevron-up"
                onPress={close}
              />
            ) : (
              <TextInput.Icon
                style={AffixStyle}
                name="chevron-down"
                onPress={open}
              />
            )
          }
        />
      }>
      {options.filter(byQuery).sort().map(MenuItem)}
    </Menu>
  );
}

const Style = StyleSheet.create({
  dropdown: {
    backgroundColor: '#FFF',
  },
  dropdownError: {
    backgroundColor: '#FFF',
    borderColor: 'red',
    borderWidth: 1,
  },
  dropdownContent: {
    width: '100%',
    color: '#777',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownValue: {
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  menu: {
    backgroundColor: 'white',
    marginTop: 22,
  },
  menuItem: {
    height: 40,
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  menuTitle: {
    color: '#777',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

interface Props {
  allowCustomValue?: boolean;
  error?: boolean;
  initialValue: string | null;
  height?: number;
  label?: string;
  options: string[];
  placeholder?: string;
  setValue: (option: string) => void;
  style?: TextStyle;
  width?: number | string;
  overrideValue?: string;
}
