import {
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Text,
  SafeAreaView,
} from 'react-native';
import {login, LoginTypes} from '../../Login';
import React, {useEffect, useContext} from 'react';
import {FontName} from '../../Font';
import {GoogleSignin} from '@react-native-community/google-signin';
import Context from '../../Context';
import Color from '../../Color';

const styles = StyleSheet.create({
  component: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    width: '85%',
    height: 52,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  button_text: {
    fontFamily: FontName.NotoSansKR,
    color: Color.Black,
    fontSize: 12,
  },
  text: {
    fontFamily: FontName.NotoSansKR,
    color: Color.White,
  },
  alert_text: {
    fontFamily: FontName.NotoSansKR,
    fontSize: 13,
    textAlign: 'center',
  },
});

// @ts-ignore
export default ({navigation}) => {
  const {isConnecting, set_show_error_alert, set_show_network_alert} =
    useContext(Context);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '817780727952-sp5dr5j2a7to883c98kgq70b6dr7uc76.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
    });
  }, []);

  return (
    <ImageBackground
      source={require('../../Assets/imgs/login_background.jpg')}
      resizeMode="cover"
      style={{flex: 1}}>
      <SafeAreaView style={styles.component}>
        <Text
          style={[
            styles.text,
            {
              fontSize: 31,
              marginTop: '26%',
              height: 33,
              lineHeight: 35,
            },
          ]}>
          나만의 버킷리스트
        </Text>
        <Text style={[styles.text, {fontSize: 13, height: 18, lineHeight: 20}]}>
          잊지말고 기록하며 즐기는 나만의 일상!
        </Text>
        <Text
          style={{
            fontSize: 63,
            lineHeight: 85,
            fontFamily: FontName.NotoSansKRBold,
            color: Color.White,
          }}>
          엠버
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (isConnecting) {
              login(LoginTypes.KAKAO, navigation, set_show_error_alert);
            } else {
              set_show_network_alert(true);
            }
          }}
          activeOpacity={0.75}
          style={[
            styles.button,
            {backgroundColor: Color.Kakao, marginTop: 'auto'},
          ]}>
          <Text style={styles.button_text}>카카오톡으로 로그인하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (isConnecting) {
              login(LoginTypes.FACEBOOK, navigation, set_show_error_alert);
            } else {
              set_show_network_alert(true);
            }
          }}
          activeOpacity={0.75}
          style={[styles.button, {backgroundColor: Color.FaceBook}]}>
          <Text style={[styles.button_text, {color: Color.White}]}>
            페이스북으로 로그인하기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (isConnecting) {
              login(LoginTypes.GOOGLE, navigation, set_show_error_alert);
            } else {
              set_show_network_alert(true);
            }
          }}
          activeOpacity={0.75}
          style={[
            styles.button,
            {backgroundColor: Color.Google, marginBottom: '23%'},
          ]}>
          <Text style={styles.button_text}>구글로 로그인하기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};
