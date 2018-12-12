import React from 'react';
import {
  createStackNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation';

import InitiatorScreen from '../screens/Initiator';

const HomeStack = createStackNavigator({
  Home: InitiatorScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Initiator'
};

export default createMaterialTopTabNavigator({
  HomeStack
});
