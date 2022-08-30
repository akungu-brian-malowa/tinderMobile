import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import {Foundation, Ionicons} from "@expo/vector-icons"
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native'

const Header = ({title, callEnabled}) => {
    const navigation = useNavigation();

  return (
    <SafeAreaView style={tw`pt-10 flex-row items-center justify-between`}>
      <View style={tw`flex flex-row items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
              <Ionicons name='chevron-back-outline' size={34} color='#FF5864'/>
          </TouchableOpacity>
          <Text style={tw`text-xl font-bold pl-2`}>{title}</Text>
      </View>

      {callEnabled && (
        <TouchableOpacity style={tw`rounded-full h-10 w-10 mr-4 p-3 bg-red-200`}>
            <Foundation style={tw``} name='telephone' size={20} color='red'/>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}

export default Header