import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './need_login/LoginScreen';
import SetNickName from './need_login/SetNickName';

import BottomTab from './login/BottomTab';
import WriteBucket from './login/screens/WriteBucket';
import EditBucket from './login/screens/EditBucket';
import Setting from './login/screens/Setting';
import EditNickName from './login/screens/EditNickName';
import SearchBottomTab from './login/screens/onSearch/SearchBottomTab';
import OSSList from './login/screens/OSSList';
import OSSInfo from './login/screens/OSSInfo';

import {Platform, View} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {UserData} from '../DataTypes';
import firestore from '@react-native-firebase/firestore';
import Context, {LoginContext} from '../Context';
import {get_data} from '../DB';
import Color from '../Color';

const NeedLoginStack = createStackNavigator();
const LoginStack = createStackNavigator();

async function update_data(
  isConnecting: boolean | null,
  userId: string,
  set_fun: Function,
  network_error: Function,
  error: Function,
): Promise<void> {
  if (!isConnecting) {
    network_error(true);
    return;
  }
  try {
    set_fun(await get_data(userId));
  } catch (_) {
    error(true);
  }
}

export const NotLogin = () => {
  return (
    <NavigationContainer>
      <NeedLoginStack.Navigator
        initialRouteName={'LoginScreen'}
        screenOptions={{headerShown: false}}>
        <NeedLoginStack.Screen name={'LoginScreen'} component={LoginScreen} />
        <NeedLoginStack.Screen name={'SetNickName'} component={SetNickName} />
      </NeedLoginStack.Navigator>
    </NavigationContainer>
  );
};

export const Login = () => {
  const {userId, isConnecting, set_show_network_alert, set_show_error_alert} =
    useContext(Context);
  const [userData, setUserData] = useState<UserData>({
    nickname: '',
    buckets: [],
    completed_buckets: [],
    stars: [],
  });

  useEffect(() => {
    async function init() {
      update_data(
        isConnecting,
        userId,
        setUserData,
        set_show_network_alert,
        set_show_error_alert,
      );

      await firestore()
        .collection('mber')
        .doc(userId)
        .onSnapshot(
          querySnapshot => {
            if (isConnecting) {
              // @ts-ignore
              setUserData(querySnapshot.data());
            }
          },
          _error => {},
        );
    }

    init();
  }, []);

  return (
    <NavigationContainer>
      <LoginContext.Provider
        value={{
          userData: userData,
          setUserData: setUserData,
        }}>
        {Platform.OS === 'ios' ? (
          <View
            style={{
              height: getStatusBarHeight(),
              width: '100%',
              backgroundColor: Color.ThemeColor,
            }}
          />
        ) : null}
        <LoginStack.Navigator
          initialRouteName={'HomeScreen'}
          screenOptions={{headerShown: false}}>
          <LoginStack.Screen name={'HomeScreen'} component={BottomTab} />
          <LoginStack.Screen
            name={'WriteBucketScreen'}
            component={WriteBucket}
          />
          <LoginStack.Screen name={'EditBucketScreen'} component={EditBucket} />
          <LoginStack.Screen name={'SettingScreen'} component={Setting} />
          <LoginStack.Screen
            name={'EditNickNameScreen'}
            component={EditNickName}
          />
          <LoginStack.Screen name={'SearchUser'} component={SearchBottomTab} />
          <LoginStack.Screen name={'OSSList'} component={OSSList} />
          <LoginStack.Screen name={'OSSInfo'} component={OSSInfo} />
        </LoginStack.Navigator>
      </LoginContext.Provider>
    </NavigationContainer>
  );
};
