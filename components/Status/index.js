import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Status = ({ text, isTrue }) => (
  <View style={styles.container}>
    <Text style={isTrue ? styles.textGreen : styles.textRed}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 5
  },
  textGreen: {
    color: 'green'
  },
  textRed: {
    color: 'red'
  }
});

export default Status;
