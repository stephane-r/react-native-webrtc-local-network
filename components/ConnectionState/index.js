import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ConnectionState = ({ text }) => (
  <View style={styles.container}>
    <Text>Connection state</Text>
    <Text style={styles.textAlert}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textAlert: {
    textAlign: 'center',
    padding: 10,
    color: 'red'
  },
  textSuccess: {
    color: 'green'
  }
});

export default ConnectionState;
