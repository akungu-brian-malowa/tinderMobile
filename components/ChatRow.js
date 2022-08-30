import { View, Text , TouchableOpacity, Image} from 'react-native'
import React, {useEffect, useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth';   
import tw from 'tailwind-react-native-classnames';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import { db } from '../firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const ChatRow = ({ matchDetails }) => {
    const navigation = useNavigation();
    const { user } =useAuth();
    const [matchedUserInfo, setMatchedUserInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState('');
        

        
    useEffect(() => {
       setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
    }, [matchDetails, user]);

    useEffect(() => 
     onSnapshot(
       query(collection(db, 'matches', matchDetails.id, 'messages' ),
       orderBy('timestamp', 'desc')
        ), snapshot => setLastMessage(snapshot.docs[0]?.data()?.message)
       ),
        

     [matchDetails, db])

  return (
    <TouchableOpacity 
    style={tw`flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg`}
    onPress={() => navigation.navigate("Message", {
      matchDetails,
    })}
    >
      <Image 
      style={tw`rounded-full h-16 w-16 pr-4`}
      source={{ uri: matchedUserInfo?.photoURL}}
      />
      <View style={tw`pl-2`}>
        <Text style={tw`text-lg font-semibold`}>
          {matchedUserInfo?.displayName}
        </Text>
        <Text> {lastMessage || "Say Hi..! "}</Text>

      </View>
    </TouchableOpacity>
  )
}

export default ChatRow;