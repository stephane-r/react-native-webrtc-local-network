import React from 'react';
import { StyleSheet, View } from 'react-native';
import SwitchNavigator from './navigation/SwitchNavigator';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <SwitchNavigator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
