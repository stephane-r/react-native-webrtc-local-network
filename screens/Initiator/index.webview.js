import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

const HTML = require('../../web/index.html');

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <WebView source={HTML} />
      </View>
    );
  }
}

export default HomeScreen;
