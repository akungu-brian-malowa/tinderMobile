import {Button, View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import React, {useLayoutEffect} from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigation } from '@react-navigation/core';
import tw from 'tailwind-react-native-classnames';


const LoginScreen = () => {

  const {signInWithGoogle, loading} = useAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown:false,
    });

  }, []);

  return (
    <View style={tw`flex-1`}>
      <ImageBackground
      resizeMode='cover'
      style={tw`flex-1`}
      source={{uri: "https://tinder.com/static/tinder.png"}}>

        <TouchableOpacity style={[
          tw`absolute bottom-40 w-52 bg-white p-4 rounded-2xl`, 
          {marginHorizontal: `25%`}]}
          onPress={signInWithGoogle}
          >
        <Text style={tw`font-semibold text-center`}>
          Sign in & get Swiped
        </Text>
        </TouchableOpacity>

        

      </ImageBackground>
    </View>
  )
}

export default LoginScreen