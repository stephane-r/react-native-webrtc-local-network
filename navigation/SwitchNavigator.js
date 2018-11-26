import React from 'react';
import { createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './TabNavigator';

const SwitchNavigator = createSwitchNavigator({
  Main: MainTabNavigator
});

export default SwitchNavigator;
