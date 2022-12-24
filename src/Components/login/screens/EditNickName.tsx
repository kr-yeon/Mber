import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Keyboard, BackHandler
} from "react-native";
import React, {useState, useContext, useEffect} from 'react';
import {FontName} from '../../../Font';
import {DefaultAlert} from '../../../Alerts';
// @ts-ignore
import Context from '../../../Context';
import {duplicate_check, get_nick_name, set_nickname} from '../../../DB';
import Color from '../../../Color';

const styles = StyleSheet.create({
  component: {
    flex: 1,
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
});

// @ts-ignore
export default ({navigation}) => {
  const {isConnecting, set_show_network_alert, set_show_error_alert, userId} =
    useContext(Context);
  const [nick_name, set_nick_name] = useState<string>('');
  const [show_alert, set_show_alert] = useState<boolean>(false);
  const [place_holder, set_place_holder] = useState<string>('');
  const [yes_alert, set_yes_alert] = useState<boolean>(false);
  const [length_zero_alert, set_length_zero_alert] = useState<boolean>(false);

  useEffect(() => {
    async function init() {
      set_place_holder(await get_nick_name(userId));
    }

    init();

    function BackPress() {
      navigation.goBack();
      return true;
    }

    BackHandler.addEventListener('hardwareBackPress', BackPress);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', BackPress);
  }, []);

  return (
    <ScrollView style={{flex: 1}} scrollEnabled={false}>
      <ImageBackground
        source={require('../../../Assets/imgs/set_nickname_background.jpg')}
        resizeMode="cover"
        style={styles.component}>
        <SafeAreaView style={styles.component}>
          <DefaultAlert
            show={yes_alert}
            title={'정말로 변경하시겠습니까?'}
            message={'닉네임은 다시 변경할 수 있습니다.\n정말 변경하겠습니까?'}
            showConfirmButton={true}
            showCancelButton={true}
            confirmText={'확인'}
            cancelText={'취소'}
            onConfirmPressed={() => {
              Keyboard.dismiss();
              set_yes_alert(false);
              if (isConnecting) {
                duplicate_check(nick_name.trim())
                  .then(s => {
                    if (s) {
                      set_show_alert(true);
                    } else {
                      set_nickname(userId, nick_name.trim());
                      navigation.goBack();
                    }
                  })
                  .catch(_ => set_show_error_alert(true));
              } else {
                set_show_network_alert(true);
              }
            }}
            onCancelPressed={() => {
              Keyboard.dismiss();
              set_yes_alert(false);
            }}
          />
          <DefaultAlert
            show={show_alert}
            title={'닉네임이 중복되었습니다'}
            message={
              '해당 닉네임을 사용하고 있는 유저가 있습니다.\n다른 닉네임을 사용해주시길 바랍니다.'
            }
            showConfirmButton={true}
            confirmText={'확인'}
            onConfirmPressed={() => set_show_alert(false)}
          />
          <DefaultAlert
            show={length_zero_alert}
            title={'닉네임을 입력해주세요'}
            message={'닉네임을 입력해주세요.'}
            showConfirmButton={true}
            confirmText={'확인'}
            onConfirmPressed={() => set_length_zero_alert(false)}
          />
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
          <Text
            style={[styles.text, {fontSize: 13, height: 18, lineHeight: 20}]}>
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
          <TextInput
            style={[
              styles.button,
              styles.button_text,
              {
                backgroundColor: Color.White,
                marginTop: 'auto',
                textAlign: 'center',
                height: 55,
              },
            ]}
            placeholderTextColor={Color.Silver}
            placeholder={place_holder}
            textAlign={'center'}
            value={nick_name}
            onChangeText={set_nick_name}
            maxLength={20}
          />
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              if (nick_name.trim().length === 0) {
                set_length_zero_alert(true);
              } else {
                set_yes_alert(true);
              }
            }}
            activeOpacity={0.75}
            style={[styles.button, {backgroundColor: Color.ThemeColor}]}>
            <Text style={[styles.button_text, {color: Color.ThemeText}]}>수정하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              navigation.goBack();
            }}
            activeOpacity={0.75}
            style={[
              styles.button,
              {backgroundColor: Color.White, marginBottom: '53%'},
            ]}>
            <Text style={styles.button_text}>뒤로가기</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    </ScrollView>
  );
};
