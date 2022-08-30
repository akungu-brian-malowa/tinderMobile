import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import tw from 'tailwind-react-native-classnames';
import {db} from '../firebase';
import useAuth from '../hooks/useAuth';
import { setDoc, doc, serverTimestamp,  } from '@firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const ModalScreen = () => {
    const {user} = useAuth();
    const navigation = useNavigation();
    const [image, setImage] = useState([]);
    const [job, setJob] = useState([]);
    const [age, setAge] = useState([]);
    

    const incompleteform = !image || !job || !age;

    const updateUserProfile = () => {
        setDoc(doc(db, 'users', user.uid), {

            id : user.uid,
            displayName: user.displayName,
            photoURL: image,
            job: job,
            age: age,
            timestamp: serverTimestamp(),
        })
        .then(() => {
            navigation.navigate('Home');
        })
        .catch((error )=> {
            alert(error.message);
        })
    };


  return (
    <View style={tw`flex-1 items-center pt-5`}>
     <Image
     style={tw`h-20 w-full`}
     resizeMode="contain" 
     source={{ uri: "https://links.papareact.com/2pf"}}/>

     <Text style={tw`text-xl text-gray-500 p-2 font-bold`}>
         Welcome {user.displayName}
     </Text>

     <Text style={tw`text-center p-4 font-bold  text-red-400`}>
         Step 1: The Profile Pic
     </Text>
     <TextInput
     value={image}
     onChangeText={text => setImage(text)}
     style={tw`text-center text-xl pb-2`}
     placeholder='Enter a profile pic URL' />

     <Text style={tw`text-center p-4 font-bold  text-red-400`}>
         Step 2: The Job
     </Text> 
     <TextInput
     value={job}
     onChangeText={text =>setJob(text)}    style={tw`text-center text-xl pb-2`}
     placeholder='Enter your occupation' />

     <Text style={tw`text-center p-4 font-bold  text-red-400`}>
         Step 3: The Age
     </Text>
     <TextInput
     value={age}
     onChangeText={text => setAge(text)}    style={tw`text-center text-xl pb-2`}
     placeholder='Enter your age'
     keyboardType='numeric'
     maxLength={2} />

     <TouchableOpacity 
     disabled={incompleteform}
     style={[ 
         tw` w-64 p-3 rounded-xl absolute bottom-10 bg-red-400`,
         incompleteform ? tw`bg-gray-400` : tw`bg-red-400`]
         }
         onPress={updateUserProfile}>
         <Text style={tw`text-center text-white text-xl`} >Update Profile</Text>
     </TouchableOpacity>

    </View>
  )
}

export default ModalScreen