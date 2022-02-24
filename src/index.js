import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AppContext from './context/AppContext';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';

import { Main } from './navigation/Main';

export default function App() {
  const [shopList, setShopList] = useState([]);
  const [userProfile, setUserProfile] = useState();

  useEffect(() => {
    axios.get(`https://fitto-api-server.herokuapp.com/items`).then(response => {
      if (response.data.length === 0) {
        return;
      } else {
        setShopList(response.data);
      }
    });
  }, []);
  return (
    <AppContext.Provider
      value={{
        shopList: shopList,
        setShopList: setShopList,

        userProfile: userProfile,
        setUserProfile: setUserProfile,
      }}
    >
      <StatusBar style="auto" />
      <NavigationContainer>
        <Main />
      </NavigationContainer>
    </AppContext.Provider>
  );
}
