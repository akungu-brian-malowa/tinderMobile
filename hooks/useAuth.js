import { View, Text } from 'react-native'
import React, { createContext, useContext, useState, useEffect, useMemo} from 'react';
import * as Google from 'expo-google-app-auth';
import {
  GoogleAuthProvider,
  onAuthStateChanged, 
  signInWithCredential,
  signOut,

} from "@firebase/auth" 
import { auth } from '../firebase';

const AuthContext = createContext({});
const config ={
    androidClientId:'118998147594-dbnco0hbh816lrakk6pdabvh28sjifra.apps.googleusercontent.com',
    iosClientId:'118998147594-fdt2bn61gguot5nfbq767kfle05p5deo.apps.googleusercontent.com',
    scopes: ["profile", "email"],
    permissinos: ["public_profile", "email", "gender", "location"], 
}

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingiInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);   

  useEffect(
    () => 
      onAuthStateChanged(auth, (user) => {
      if (user) {
        //logged in......
        setUser(user);
      }else{
        // not logged in......
        setUser(null);
      }
      setLoadingInitial(false);
      }),
  []
  );
    
    const logout = () => {
      setLoading(true);

      signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
    }
    const signInWithGoogle = async() => {
      setLoading(true);

       await Google.logInAsync(config).then(async (logInResult) => { 
            if(logInResult.type === 'success') {
                //login
                const {idToken, accessToken} = logInResult;
                const credential = GoogleAuthProvider.credential(idToken, accessToken);
                await signInWithCredential(auth, credential);
            }
            return Promise.reject();    
        })
        .catch(error => (error))
        .finally(() => setLoading(false));
    }

    const memoedValue = useMemo(() => ({
      user,
      loading,
      error,
      signInWithGoogle, 
      logout,

    }), [user, loading, error]);
  return (
    <AuthContext.Provider 
    value={memoedValue}
    >
      {!loadingiInitial && children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
return useContext(AuthContext);
}


