import React from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { autobind } from 'core-decorators';

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  @autobind
  createOffer() {
    alert('create offer');
  }

  @autobind
  createResponse() {
    alert('create response');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <Text>Emitter</Text>
          <Text>video</Text>
          <Button title="Create offer" onPress={this.createOffer} />
          <TextInput placeholder="Emitter offer" />
        </View>
        <View style={styles.view}>
          <Text>Receiver</Text>
          <Text>video</Text>
          <Button title="Send offer" onPress={this.createResponse} />
          <TextInput placeholder="Receiver offer" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  view: {
    flex: 1
  }
});

export default HomeScreen;
