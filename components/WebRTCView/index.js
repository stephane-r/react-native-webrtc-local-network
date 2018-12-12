import React from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';
import { RTCView } from 'react-native-webrtc';

const WebRTCView = ({
  streamURL,
  onPress,
  title,
  placeholder,
  disabled,
  onChangeText,
  value
}) => (
  <View style={styles.view}>
    <Button title={title} onPress={onPress} disabled={disabled} />
    <TextInput
      placeholder={placeholder}
      onChangeText={value => onChangeText(value)}
      value={value}
    />
    {/* <RTCView streamURL={streamURL} style={styles.video} /> */}
  </View>
);

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  video: {
    height: '60%',
    marginTop: 50
  }
});

export default WebRTCView;
