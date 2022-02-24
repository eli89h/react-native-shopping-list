import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { List } from '../screens/List';
import { ItemList } from '../screens/ItemList';
import { Profile } from '../screens/Profile';

const MainStack = createStackNavigator();

export const Main = () => (
  <MainStack.Navigator>
    <MainStack.Screen name="Shopping List" component={List} />
    <MainStack.Screen
      name="ItemList"
      component={ItemList}
      options={{ headerTitle: 'Item List' }}
    />

    <MainStack.Screen
      name="Profile"
      component={Profile}
      options={{ headerTitle: 'Profile' }}
    />
  </MainStack.Navigator>
);
