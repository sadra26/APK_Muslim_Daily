// ini file input.jsx

import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';

const Input = ({
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },

  input: {
    backgroundColor: '#F4F4F4',
    borderRadius: 15,
    paddingHorizontal: 20,
    height: 55,
    fontSize: 16,
    color: '#000',
  },
});

export default Input;