import React from 'react';
import { View, ScrollView } from 'react-native';

class App extends React.Component {
  render() {
    return (
      <View>
        <ScrollView>{this.props.children}</ScrollView>
      </View>
    );
  }
}

export default App;
