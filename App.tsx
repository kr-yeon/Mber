import React, {useEffect, useState} from 'react';
import {
  Text,
  ImageBackground,
  StatusBar,
  View,
  TextInput,
  LogBox,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageKey} from './src/StorageKey';
import {NotLogin, Login} from './src/Components/Screens';
import Context from './src/Context';
import NetInfo from '@react-native-community/netinfo';
import {ErrorAlert, NetworkAlert} from './src/Alerts';
import Color from './src/Color';

// @ts-ignore
Text.defaultProps = Text.defaultProps || {};
// @ts-ignore
Text.defaultProps.allowFontScaling = false;
// @ts-ignore
TextInput.defaultProps = TextInput.defaultProps || {};
// @ts-ignore
TextInput.defaultProps.allowFontScaling = false;

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  "Can't perform a React state update on an unmounted component.",
]);

let exitApp: boolean = false;

function handleBackButton() {
  let timeout;

  if (!exitApp) {
    ToastAndroid.show('한번 더 뒤로가면 앱이 종료됩니다.', ToastAndroid.SHORT);
    exitApp = true;
    timeout = setTimeout(() => {
      exitApp = false;
    }, 2000);
  } else {
    // @ts-ignore
    clearTimeout(timeout);
    BackHandler.exitApp();
  }

  return true;
}

const App = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean | null>(true);
  const [show_error_alert, set_show_error_alert] = useState<boolean>(false);
  const [show_network_alert, set_show_network_alert] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(false);
  const [uId, setUId] = useState<string>('');

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    async function initIsLogin() {
      const userId = await AsyncStorage.getItem(StorageKey.userId);
      const recentSearch = await AsyncStorage.getItem(StorageKey.RecentSearch);

      if (recentSearch === null){
        await AsyncStorage.setItem(StorageKey.RecentSearch, '[]');
      }

      if (userId === null) {
        setIsLogin(false);
      } else {
        setUId(userId);
        setIsLogin(true);
      }
      setLoad(true);
    }

    setTimeout(() => {
      SplashScreen.hide();
    }, 1750);

    NetInfo.addEventListener(state => setIsConnecting(state.isConnected));

    initIsLogin();

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
  }, []);

  return load ? (
    <View style={{flex: 1}}>
      <Context.Provider
        value={{
          isConnecting: isConnecting,
          userId: uId,
          set_show_network_alert: set_show_network_alert,
          set_show_error_alert: set_show_error_alert,
        }}>
        <ErrorAlert
          status={show_error_alert}
          set_status={set_show_error_alert}
        />
        <NetworkAlert
          status={show_network_alert}
          set_status={set_show_network_alert}
        />
        <StatusBar
          backgroundColor={Color.ThemeColor}
          animated={true}
          barStyle="light-content"
        />
        {isLogin ? <Login /> : <NotLogin />}
      </Context.Provider>
    </View>
  ) : (
    <ImageBackground
      source={require('./src/Assets/imgs/splash.png')}
      resizeMode="cover"
      style={{flex: 1}}
    />
  );
};

export default App;
