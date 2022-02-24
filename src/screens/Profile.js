import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Button,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Card } from 'react-native-elements';
import { Constants } from 'expo';
import AppContext from '../context/AppContext';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
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

export const Profile = () => {
  const appContext = useContext(AppContext);
  const userProfile = appContext.userProfile;
  const setUserProfile = appContext.setUserProfile;
  const shopList = appContext.shopList;
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [email, setEmail] = useState();
  const [address, setAdress] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [isFormIncomplete, setIsFormIncomplete] = useState(true);
  const [image, setImage] = useState('');
  const [uploding, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    dateOfBirth,
  });

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const user = await axios.get(
          'https://fitto-api-server.herokuapp.com/user',
        );
        setUserProfile(user.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (firstName && lastName && email && address && dateOfBirth) {
      setIsFormIncomplete(false);
      setFormData({
        firstName: firstName,
        lastName: lastName,
        email: email,
        address: address,
        dateOfBirth: dateOfBirth,
      });
    } else {
      setIsFormIncomplete(true);
    }
  }, [firstName, lastName, email, address, dateOfBirth]);

  const handleUpdateUser = async pic => {
    console.log('AAAAA', JSON.stringify(formData));
    console.log(pic);
    const res = await axios.put(
      `https://fitto-api-server.herokuapp.com/user/update`,
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        profilePic: pic,
      },
    );
    console.log(res.data);
    setUserProfile(res.data);
  };

  const handleSubmit = async () => {
    if (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.address &&
      formData.dateOfBirth
    ) {
      const userPic = await updateUserPic();
      await handleUpdateUser(userPic);
      setFormData('');
      setUploading(false);
    }
  };

  const updateUserPic = async () => {
    try {
      setUploading(true);
      const response = await fetch(image);
      const blob = await response.blob();
      const picFormData = new FormData();
      picFormData.append('picture', blob);
      const picResult = await axios.put(
        `https://fitto-api-server.herokuapp.com/user/user-pic-upload`,
        picFormData,
      );
      console.log(picResult.data.picture);
      return picResult.data.picture;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card>
          <Card.Title>
            Name:{' '}
            {userProfile && userProfile.firstName + ' ' + userProfile.lastName}
          </Card.Title>
          <Card.Divider />
          <Card.Image
            style={{ width: 320, height: 320 }}
            // source={userProfile && userProfile.profilePic}
            source={{ uri: userProfile && userProfile.profilePic }}
          ></Card.Image>
          <Text style={{ marginBottom: 10 }}>
            Address: {userProfile && userProfile.address}
          </Text>
          <Text style={{ marginBottom: 10 }}>
            Email: {userProfile && userProfile.email}
          </Text>
          <Text style={{ marginBottom: 10 }}>
            Birth Date: {userProfile && userProfile.dateOfBirth}
          </Text>
        </Card>
        <Text>Item List:</Text>
        {shopList &&
          shopList.map(listItem => {
            return (
              listItem.status === 1 && (
                <View key={listItem.id} className="listItem">
                  <Text className="listItemQuantity">{listItem.quantity}X</Text>
                  <Text className="listItemContent mx-2">
                    {listItem.content}
                  </Text>
                </View>
              )
            );
          })}

        <TextInput
          label="Update First Name"
          placeholder="Update First Name..."
          value={firstName}
          onChangeText={text => setFirstName(text)}
          //errorText={errors.email}
          //keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="Update Last Name"
          placeholder="Update Last Name..."
          value={lastName}
          onChangeText={text => setLastName(text)}
          //errorText={errors.email}
          //keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="Update Email"
          placeholder="Update Email..."
          value={email}
          onChangeText={text => setEmail(text)}
          //errorText={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="Update Address"
          placeholder="Update Address..."
          value={address}
          onChangeText={text => setAdress(text)}
          //errorText={errors.email}
          //keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="Update Date of Birth"
          placeholder="Update Date of Birth..."
          value={dateOfBirth}
          onChangeText={text => setDateOfBirth(text)}
          //errorText={errors.email}
          //keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button title="Choose Photo" onPress={pickImage} />

        {!uploding ? (
          <Button onPress={() => handleSubmit()} title="Update Profile" />
        ) : (
          <ActivityIndicator size="large" color="#000" />
        )}
      </ScrollView>
    </View>
  );
};
