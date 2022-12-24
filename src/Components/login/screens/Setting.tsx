import React, {useContext, useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {FontName} from '../../../Font';
import {DefaultAlert} from '../../../Alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import RNRestart from 'react-native-restart';
import Context from '../../../Context';
import {del_data} from '../../../DB';
import Color from '../../../Color';

const styles = StyleSheet.create({
  component: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Color.White,
  },
  header: {
    backgroundColor: Color.ThemeColor,
    width: '100%',
    height: 50,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  HeaderText: {
    color: Color.ThemeText,
    fontFamily: FontName.NotoSansKR,
    marginLeft: 16,
    fontSize: 14,
  },
  TouchButton: {
    width: '100%',
    height: 60,
    display: 'flex',
    justifyContent: 'center',
  },
  TouchText: {
    color: Color.Black,
    fontFamily: FontName.NotoSansKR,
    marginLeft: 16,
    fontSize: 14,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: Color.Silver,
  },
});

// @ts-ignore
export default function ({navigation}) {
  const {userId, isConnecting, set_show_network_alert} = useContext(Context);
  const [logout_alert, set_logout_alert] = useState<boolean>(false);
  const [resign_alert_1, set_resign_alert_1] = useState<boolean>(false);
  const [resign_alert_2, set_resign_alert_2] = useState<boolean>(false);
  const [resign_alert_3, set_resign_alert_3] = useState<boolean>(false);

  useEffect(() => {
    function BackPress() {
      navigation.goBack();
      return true;
    }

    BackHandler.addEventListener('hardwareBackPress', BackPress);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', BackPress);
  }, []);

  return (
    <SafeAreaView style={styles.component}>
      <DefaultAlert
        show={logout_alert}
        title={'로그아웃'}
        message={'정말로 로그아웃 하시겠습니까?'}
        showConfirmButton={true}
        showCancelButton={true}
        confirmText={'확인'}
        cancelText={'취소'}
        onConfirmPressed={() => {
          set_logout_alert(false);
          AsyncStorage.clear().then(_ => RNRestart.Restart());
        }}
        onCancelPressed={() => {
          set_logout_alert(false);
        }}
      />
      <DefaultAlert
        show={resign_alert_1}
        title={'회원 탈퇴'}
        message={'탈퇴 하시겠습니까?'}
        showConfirmButton={true}
        showCancelButton={true}
        confirmText={'확인'}
        cancelText={'취소'}
        onConfirmPressed={() => {
          set_resign_alert_1(false);
          set_resign_alert_2(true);
        }}
        onCancelPressed={() => {
          set_resign_alert_1(false);
        }}
      />
      <DefaultAlert
        show={resign_alert_2}
        title={'회원 탈퇴'}
        message={'정말 탈퇴 하시겠습니까?'}
        showConfirmButton={true}
        showCancelButton={true}
        confirmText={'확인'}
        cancelText={'취소'}
        onConfirmPressed={() => {
          set_resign_alert_2(false);
          set_resign_alert_3(true);
        }}
        onCancelPressed={() => {
          set_resign_alert_2(false);
        }}
      />
      <DefaultAlert
        show={resign_alert_3}
        title={'회원 탈퇴'}
        message={'진짜로요?? ㅠㅠ'}
        showConfirmButton={true}
        showCancelButton={true}
        confirmText={'네!!'}
        cancelText={'취소'}
        onConfirmPressed={() => {
          set_resign_alert_3(false);
          AsyncStorage.clear().then(_ => {
            del_data(userId).then(_ => RNRestart.Restart());
          });
        }}
        onCancelPressed={() => {
          set_resign_alert_3(false);
        }}
      />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}>
          <Text style={styles.HeaderText}>이전</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.TouchButton}
        activeOpacity={0.6}
        onPress={() => navigation.navigate('EditNickNameScreen')}>
        <Text style={styles.TouchText}>닉네임 변경</Text>
      </TouchableOpacity>
      <View style={styles.line} />
      <TouchableOpacity
        style={styles.TouchButton}
        activeOpacity={0.6}
        onPress={() => navigation.navigate('OSSList')}>
        <Text style={styles.TouchText}>오픈소스 라이선스</Text>
      </TouchableOpacity>
      <View style={styles.line} />
      <TouchableOpacity
        style={styles.TouchButton}
        activeOpacity={0.6}
        onPress={() => set_logout_alert(true)}>
        <Text style={styles.TouchText}>로그아웃</Text>
      </TouchableOpacity>
      <View style={styles.line} />
      <TouchableOpacity
        style={styles.TouchButton}
        activeOpacity={0.6}
        onPress={() => {
          if (!isConnecting) {
            set_show_network_alert(true);
          } else {
            set_resign_alert_1(true);
          }
        }}>
        <Text style={[styles.TouchText, {color: Color.Silver}]}>탈퇴하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
