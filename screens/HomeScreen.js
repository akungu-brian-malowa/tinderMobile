import {Button, View, Text, TouchableOpacity, Image,  } from 'react-native'
import React, {useRef, useState, useLayoutEffect, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import {AntDesign, Entypo, Ionicons} from "@expo/vector-icons"
import Swiper from "react-native-deck-swiper"
import {db} from '../firebase';
import { onSnapshot, doc, collection, setDoc, getDocs, query, where, serverTimestamp, getDoc  } from 'firebase/firestore';
import generatedid from '../lib/generatedid';

const DAMMY_DATA = [
  {
    firstName: "Sonny",
    secondName: "Sssangha",
    job: "Software Developer",
    photoURL: "https://avatars.githubusercontent.com/u/24712956?v=4",
    age: 40,
    id: 8565,
  },
  {
    firstName: "Elon",
    secondName: "Musk",
    job: "CEO @TESLA",
    photoURL: "https://www.biography.com/.image/t_share/MTY2MzU3Nzk2OTM2MjMwNTkx/elon_musk_royal_society.jpg",
    age: 40,
    id: 9789,
  },
  {
    firstName: "Jeff",
    secondName: "Bezzos",
    job: "CEO @AMAZON",
    photoURL: "https://www.biography.com/.image/t_share/MTY2MzU3Nzk2OTM2MjMwNTkx/elon_musk_royal_society.jpg",
    age: 40,
    id: 67763,
  },
];









const HomeScreen = () => {
    const navigation = useNavigation();
    const {user, logout} = useAuth();
    const [profiles, setProfiles] = useState([]);
    const swipeRef = useRef(null);

    useLayoutEffect(
      () => 
          onSnapshot(doc(db, "users", user.uid),
           (snapshot) => {
        if(!snapshot.exists()) {
          navigation.navigate("Modal");
        }
      }),
     []
     );


  useEffect(() => {
  let unsub;

  const fetchCards = async () => {
    
    const passes = await getDocs(collection(db, "users", user.uid, "passes",))
  .then(snapshot => snapshot.docs.map((doc) => doc.id)
  );

  const swipes = await getDocs(collection(db, "users", user.uid, "swipes",))
  .then(snapshot => snapshot.docs.map((doc) => doc.id)
  );

  const passedUserIds = passes.length > 0 ? passes : ["test"];
  const swipedUserIds = swipes.length > 0 ? swipes : ["test"];

    unsub = onSnapshot(
      query(collection(db, 'users'), where("id", "not-in", [...passedUserIds, ...swipedUserIds])),
       (snapshot) => {
         setProfiles(
           snapshot.docs
           .filter((doc) => doc.id !== user.uid)
           .map((doc) => ({
             id: doc.id,
             ...doc.data(),
           }))
         );

    } );

  };

  fetchCards();
  return unsub;
}, [db]);
   
const swipeLeft =  (cardIndex) => {
  if(!profiles[cardIndex]) return;

  const userSwiped = profiles[cardIndex];
  console.log(`you swiped PASS on ${userSwiped.displayName}`
  );
  setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id),
  userSwiped);

};
const swipeRight = async (cardIndex) => {
  if(!profiles[cardIndex]) return;

  const userSwiped = profiles[cardIndex];
  const loggedInProfile = await (await getDoc(doc(db, "users", user.uid))
  ).data();

  //check if the user swiped on you....
  getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid))
  .then((documentSnapshot) => {
    if(documentSnapshot.exists()) {
      //user has matched with you before you mattched with them...
      // creat a match
      setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id),
      userSwiped);
      //craete a match
      setDoc(doc(db, 'matches', generatedid(user.uid, userSwiped.id)), {
        users: {
          [user.uid]: loggedInProfile,
          [userSwiped.id]: userSwiped
        },
        usersMatched: [user.uid, userSwiped.id],
        timestamp: serverTimestamp(),
      });

      navigation.navigate("Match", {
       
        loggedInProfile,
        userSwiped,
         
      });
        
      

    }else {
      //user has swiped for the first time between the two....
      console.log(`you swiped on ${userSwiped.displayName} (${userSwiped.job})`
      );
      setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id),
      userSwiped);

    }
  });

  console.log(`you swiped on ${userSwiped.displayName} (${userSwiped.job})`
  );
  setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id),
  userSwiped);
  
};
  
    
  return (
    <SafeAreaView style={tw`flex-1`}>
      {/*Header*/}
      <View style={tw`flex-row items-center justify-between px-5`}>

       <TouchableOpacity onPress={logout}>
        <Image 
        style={tw`h-10 w-10 rounded-full`} source={{ uri: user.photoURL}}/>
       </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image style={tw`h-14 w-14`} source={require("../tinderlogo.png")}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <Ionicons name='chatbubbles-sharp' size={30} color="#FF5864"/>
        </TouchableOpacity>

      </View>
      {/*End of Header */}

      {/*cards*/}
     <View style={tw`flex-1 -mt-6`}>
       <Swiper
       ref={swipeRef}
       containerStyle={{backgroundColor: "transparent"}}
       cards={profiles}
       stackSize={5}
       cardIndex={0}
       animateCardOpacity
       verticalSwipe={false}
       onSwipedLeft={(cardIndex) => {
         console.log("Swipe Pass")
         swipeLeft(cardIndex);
       }}
       onSwipedRight={(cardIndex) => {
         console.log("Swipe Match")
         swipeRight(cardIndex);
       }}
       overlayLabels={{
         left: {
           title: "NOPE",
           style: {
             label: {
               textAlign: "right",
               color: "red",
             },
           },
         },

         right: {
          title: "MATCH",
          style: {
            label: {
              color: "#4DED30",
            },
          },
        },

       }}


       renderCard={(card) => card ? ( 

         <View key={card.id} style={tw`relative bg-white h-3/4 rounded-xl`}>
           <Image style={tw`absolute h-full w-full rounded-xl`} source={{uri: card.photoURL}}/>

           <View 
           style={tw
           `absolute bottom-0 bg-white w-full flex-row justify-between
             items-center h-20 px-6 py-2 rounded-b-xl`}>
             <View>
               <Text style={tw`text-xl font-bold`}>
                 {card.displayName}
               </Text>
               <Text>
                 {card.job}
               </Text>
             </View>
             <Text style={tw`text-2xl font-bold`}>{card.age}</Text>
           </View>

         </View>

       ) : (
         <View 
         style={[tw`relative bg-white h-3/4 rounded-xl justify-center items-center`, 
         
         ]}>
           <Text style={tw`font-bold pb-5`}>no more profiles</Text>

           <Image 
           style={tw`h-20 w-20`}
           height={100}
           width={100}
           source={{ uri: "https://links.papareact.com/6gb"}}/>

         </View>

       ) }/>
     </View>

     <View style={tw`flex flex-row justify-evenly`}>
       <TouchableOpacity 
       onPress={() => swipeRef.current.swipeLeft()}
       style={tw
       `items-center justify-center rounded-full w-16 h-16 bg-red-200 `}>
         <Entypo name='cross' size={24} color="red"/>
       </TouchableOpacity>
       <TouchableOpacity
       onPress={() => swipeRef.current.swipeRight()}
       style={tw
        `items-center justify-center rounded-full w-16 h-16 bg-green-200 `}>
        <AntDesign name='heart' size={24} color="green"/>
       </TouchableOpacity>
     </View>
    </SafeAreaView>
  )
}

export default HomeScreen