import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Alert, Button } from 'react-native';
import AppContext from '../context/AppContext';
import axios from 'axios';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import colors from '../constants/colors';
import { Text } from '../components/Text';
import { TextInput } from '../components/Form';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
  },
});

export const AddItem = () => {
  const appContext = useContext(AppContext);
  const setShopList = appContext.setShopList;
  const shopList = appContext.shopList;



  const [isFormIncomplete, setIsFormIncomplete] = useState(true);
  const [content, setContent] = useState();
  const [quantity, setQuantity] = useState();
  const [formData, setFormData] = useState({
    id: '',
    quantity: '',
    content: '',
    status: '',
  });

  //   const handleChangeQuantity = e => {
  //     setQuantity(e.target.value);
  //     console.log('test');
  //   };

  //   const handleChangeContent = e => {
  //     setContent(e.target.value);
  //   };

  const handleNewList = async () => {
    console.log('AAAAA', JSON.stringify(formData));
    const res = await axios.post(
      `https://fitto-api-server.herokuapp.com/items`,
      formData,
    );
    console.log(res.data);
    setShopList(res.data);
  };

  useEffect(() => {
    if (content && quantity) {
      setIsFormIncomplete(false);
      setFormData({
        id: uuidv4(),
        quantity: quantity,
        content: content,
        status: 0,
      });
    } else {
      setIsFormIncomplete(true);
    }
  }, [content, quantity]);

  const handleSubmit = () => {
    if (formData.content && formData.quantity) {
      // setShopList((prevState) => {
      //   return [formData, ...prevState];
      // });
      handleNewList();
      setContent('');
      setQuantity('');
    }
  };



  return (
    <View style={styles.container}>
      <TextInput
        label="Item to add"
        placeholder="Item to add..."
        value={content}
        onChangeText={text => setContent(text)}
        //errorText={errors.email}
        //keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Quantity"
        placeholder="Quantity"
        value={quantity}
        onChangeText={text => setQuantity(text)}
        //errorText={errors.email}
        //keyboardType="numeric"
        autoCapitalize="none"
      />
      <Button
        onPress={() => {
          handleSubmit();
        }}
        title="Add Item"
      />

    </View>
  );
};
