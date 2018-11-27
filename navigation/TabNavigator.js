import React from 'react';
// import { Platform, StatusBar } from 'react-native';
import {
  createStackNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation';

import HomeScreen from '../screens/Home';

const HomeStack = createStackNavigator({
  Home: HomeScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home'
};

export default createMaterialTopTabNavigator({
  HomeStack
});
