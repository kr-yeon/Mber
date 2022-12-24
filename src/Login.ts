import * as KakaoLogins from '@react-native-seoul/kakao-login';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageKey} from './StorageKey';
// @ts-ignore
import RNRestart from 'react-native-restart';
import {is_join} from './DB';

export const enum LoginTypes {
  FACEBOOK = 'facebook',
  KAKAO = 'kakao',
  GOOGLE = 'google',
}

const nextStep = async (
  id: string,
  navigation: any,
  error: Function,
): Promise<void> => {
  try {
    if (!(await is_join(id))) {
      navigation.navigate('SetNickName', {id: id});
    } else {
      await AsyncStorage.setItem(StorageKey.userId, id);
      RNRestart.Restart();
    }
  } catch (_) {
    error(true);
  }
};

export const login = async (
  type: LoginTypes,
  navigation: any,
  error: Function,
): Promise<any> => {
  if (type === LoginTypes.KAKAO) {
    try {
      await KakaoLogins.login();
      nextStep(
        type + ':' + (await KakaoLogins.getProfile()).id,
        navigation,
        error,
      );
      await KakaoLogins.logout();
    } catch (e) {}
  } else if (type === LoginTypes.FACEBOOK) {
    LoginManager.logInWithPermissions(['public_profile']).then(
      result => {
        if (!result.isCancelled) {
          AccessToken.getCurrentAccessToken().then(data => {
            nextStep(type + ':' + data!.userID, navigation, error);
            LoginManager.logOut();
          });
        }
      },
      _error => {},
    );
  } else if (type === LoginTypes.GOOGLE) {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      nextStep(type + ':' + userInfo.user.id, navigation, error);
      await GoogleSignin.signOut();
    } catch (_) {}
  }
};
