import React from 'react';
// import { Platform, StatusBar } from 'react-native';
import {
  createStackNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation';

import InitiatorScreen from '../screens/Initiator';
import PeerScreen from '../screens/Peer';

const HomeStack = createStackNavigator({
  Home: InitiatorScreen
});

const PeerStack = createStackNavigator({
  Home: PeerScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Initiator'
};

PeerStack.navigationOptions = {
  tabBarLabel: 'Peer'
};

export default createMaterialTopTabNavigator({
  HomeStack
  // PeerStack
});
