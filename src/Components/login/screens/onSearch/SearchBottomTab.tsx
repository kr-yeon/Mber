import React, {useContext, useEffect, useState} from 'react';
import Color from '../../../../Color';
import TabBar from '../../../TabBar';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {get_nick_doc} from '../../../../DB';
import Context, {SearchContext} from '../../../../Context';
import {UserData} from '../../../../DataTypes';

import SearchHome from './search_bottom_screen/SearchHome';
import SearchComplete from './search_bottom_screen/SearchComplete';
import { BackHandler } from "react-native";

let load = false;

const Tab = createBottomTabNavigator();

async function update_data(
  isConnecting: boolean | null,
  userName: string,
  set_fun: Function,
  network_error: Function,
  error: Function,
): Promise<void> {
  if (!isConnecting) {
    network_error(true);
    return;
  }
  try {
    set_fun((await (await get_nick_doc(userName)).get()).data());
  } catch (_) {
    error(true);
  }
}

// @ts-ignore
export default function ({route, navigation}) {
  const userName = route.params.name;
  const {isConnecting, set_show_error_alert, set_show_network_alert} =
    useContext(Context);
  const [search_data, set_search_data] = useState<UserData>({
    nickname: '',
    buckets: [],
    completed_buckets: [],
    stars: [],
  });

  useEffect(() => {
    async function init() {
      update_data(
        isConnecting,
        userName,
        set_search_data,
        set_show_network_alert,
        set_show_error_alert,
      );

      (await get_nick_doc(userName)).onSnapshot(
        querySnapshot => {
          if (isConnecting && load) {
            set_search_data(querySnapshot.data() as UserData);
          }
        },
        _error => {},
      );
    }

    init();
    load = true;

    function BackPress() {
      navigation.goBack();
      return true;
    }

    BackHandler.addEventListener('hardwareBackPress', BackPress);
    return () => {
      load = false;
      BackHandler.removeEventListener('hardwareBackPress', BackPress);
    };
  }, []);

  return (
    <SearchContext.Provider
      value={{
        search_data: search_data,
        set_search_data: set_search_data,
        userName: userName,
      }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Color.ThemeColor,
          tabBarActiveBackgroundColor: Color.DeepThemeColor,
          tabBarInactiveBackgroundColor: 'red',
          headerShown: false,
        }}
        initialRouteName={'BottomHome'}
        tabBar={TabBar}
        backBehavior={'none'}>
        <Tab.Screen
          name={'BottomHome'}
          component={SearchHome}
          options={{
            tabBarIcon: ({size}) => (
              <MaterialCommunityIcons
                name={'format-list-text'}
                size={size}
                color={Color.ThemeText}
              />
            ),
          }}
        />
        <Tab.Screen
          name={'CompleteBuckets'}
          component={SearchComplete}
          options={{
            tabBarIcon: ({size}) => (
              <MaterialCommunityIcons
                name={'history'}
                size={size}
                color={Color.ThemeText}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SearchContext.Provider>
  );
}
