import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Alert, Button, ScrollView } from 'react-native';
import AppContext from '../context/AppContext';
import axios from 'axios';
import colors from '../constants/colors';
import { Text } from '../components/Text';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
  },
});

export const BoughtList = () => {
  const appContext = useContext(AppContext);
  const setShopList = appContext.setShopList;
  const shopList = appContext.shopList;

  const handleDelete = async id => {
    //console.log(e.target.id);
    const res = await axios.delete(
      `https://fitto-api-server.herokuapp.com/items`,
      {
        data: { id: id },
      },
    );
    console.log(res.data);
    setShopList(res.data);
  };

  return (
    <View style={styles.container}>
      <Text>BoughtList</Text>
      {shopList &&
        shopList.map(listItem => {
          return (
            listItem.status === 1 && (
              <View key={listItem.id} className="listItem">
                <Text className="listItemQuantity">{listItem.quantity}X</Text>
                <Text className="listItemContent mx-2">{listItem.content}</Text>
                <Button
                  onPress={() => {
                    handleDelete(listItem.id);
                  }}
                  title="Delete"
                />
              </View>
            )
          );
        })}
    </View>
  );
};
