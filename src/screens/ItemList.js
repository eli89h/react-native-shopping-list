import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Alert, Button, ScrollView } from 'react-native';
import AppContext from '../context/AppContext';
import axios from 'axios';
import { BoughtList } from './BoughtList';
import { AddItem } from './AddItem';
import colors from '../constants/colors';
import { TextInput } from '../components/Form';
import { Text } from '../components/Text';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
  },
});

export const ItemList = () => {
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

  const handleBought = async id => {
    //console.log(e.target.id);
    const res = await axios.put(
      `https://fitto-api-server.herokuapp.com/items`,
      {
        id: id,
      },
    );
    console.log(res.data);
    setShopList(res.data);
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        {shopList &&
          shopList.map(listItem => {
            return (
              listItem.status === 0 && (
                <View key={listItem.id} className="listItem">
                  <Text className="listItemQuantity">{listItem.quantity}X</Text>
                  <Text className="listItemContent mx-2">
                    {listItem.content}
                  </Text>
                  <Button
                    onPress={() => {
                      handleDelete(listItem.id);
                      //alert('You tapped the button!');
                    }}
                    title="Delete"
                  />

                  <Button
                    onPress={() => {
                      handleBought(listItem.id);
                      //alert('You tapped the button!');
                    }}
                    title="Bought"
                  />
                </View>
              )
            );
          })}
        <BoughtList />
        <AddItem />
      </ScrollView>
    </View>
  );
};
