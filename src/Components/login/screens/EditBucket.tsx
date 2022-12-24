import React, {useEffect, useRef, useState, useContext} from 'react';
import {
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  BackHandler,
} from 'react-native';
import {FontName} from '../../../Font';
import {Modalize} from 'react-native-modalize';
import DatePicker from 'react-native-date-picker';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import {DefaultAlert} from '../../../Alerts';
import Context from '../../../Context';
import {edit_bucket} from '../../../DB';
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
    fontSize: 15,
  },
  InputView: {
    width: '85%',
    height: 50,
    borderWidth: 1,
    borderColor: Color.Silver,
    borderRadius: 20,
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center',
  },
  TextInputStyle: {
    fontFamily: FontName.NotoSansKR,
    fontSize: 12,
    marginRight: 15,
    marginLeft: 15,
    color: Color.Black,
    height: 55,
  },
  DateTextStyle: {
    fontFamily: FontName.NotoSansKR,
    fontSize: 14,
    color: Color.Black,
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  buttonStyle: {
    width: '85%',
    height: 50,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: Color.ThemeColor,
  },
  buttonTextStyle: {
    color: Color.ThemeText,
    fontFamily: FontName.NotoSansKR,
    fontSize: 13,
  },
});

// @ts-ignore
export default function ({navigation, route}) {
  const {isConnecting, set_show_network_alert, userId} = useContext(Context);
  const modalizeRef = useRef<Modalize>(null);
  const [pickDate, setPickDate] = useState(
    new Date(
      route.params.date.split('.')[0],
      Number(route.params.date.split('. ')[1]) - 1,
      route.params.date.split('.')[2],
    ),
  );
  const [startDate, setStartDate] = useState<string>('');
  const [title, set_title] = useState<string>(route.params.title);
  const [bucket_response, set_bucket_response] = useState<string>(
    route.params.res,
  );
  const [show_title_alert, set_show_title_alert] = useState<boolean>(false);
  const [show_cancel_alert, set_show_cancel_alert] = useState<boolean>(false);

  function setBackAlert(): null {
    set_show_cancel_alert(true);
    return null;
  }

  useEffect(() => {
    setStartDate(
      pickDate.getFullYear() +
        '. ' +
        (pickDate.getMonth() + 1) +
        '. ' +
        pickDate.getDate(),
    );
  }, [pickDate]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', setBackAlert);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', setBackAlert);
  }, []);

  return (
    <SafeAreaView style={styles.component}>
      <DefaultAlert
        show={show_cancel_alert}
        title={'정말로 취소하겠습니까?'}
        message={
          '수정하신 버킷 내용은 취소시 저장되지 않습니다.\n정말로 취소하시겠습니까?'
        }
        showConfirmButton={true}
        showCancelButton={true}
        confirmText={'확인'}
        cancelText={'취소'}
        onConfirmPressed={() => {
          set_show_cancel_alert(false);
          navigation.goBack();
        }}
        onCancelPressed={() => set_show_cancel_alert(false)}
      />
      <DefaultAlert
        show={show_title_alert}
        title={'제목을 작성해주세요.'}
        message={'제목을 작성해 주세요.\n제목은 필수입니다.'}
        showConfirmButton={true}
        confirmText={'확인'}
        onConfirmPressed={() => set_show_title_alert(false)}
      />
      <Modalize
        ref={modalizeRef}
        adjustToContentHeight={true}
        childrenStyle={{display: 'flex', alignItems: 'center'}}>
        <DatePicker
          date={pickDate}
          locale={'ko'}
          mode={'date'}
          androidVariant={'nativeAndroid'}
          onDateChange={setPickDate}
          style={{
            height: 135,
            marginTop: 30,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          textColor={'black'}
        />
        <View
          style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.buttonStyle,
              {
                width: '45%',
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#C4C4C4',
              },
            ]}
            onPress={() => setPickDate(new Date())}>
            <Text style={[styles.buttonTextStyle, {color: 'black'}]}>
              오늘로 설정
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.buttonStyle, {width: '45%'}]}
            onPress={() => {
              // @ts-ignore
              modalizeRef.current.close();
            }}>
            <Text style={styles.buttonTextStyle}>확인</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: getBottomSpace() + 10}} />
      </Modalize>
      <View style={styles.header}>
        <TouchableOpacity
          style={{marginLeft: 15}}
          activeOpacity={0.6}
          onPress={() => {
            Keyboard.dismiss();
            set_show_cancel_alert(true);
          }}>
          <Text style={[styles.buttonTextStyle, {fontSize: 14}]}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginLeft: 'auto', marginRight: 14}}
          activeOpacity={0.6}
          onPress={() => {
            Keyboard.dismiss();
            if (!isConnecting) {
              set_show_network_alert(true);
            } else {
              if (title.trim().length === 0) {
                set_show_title_alert(true);
              } else {
                edit_bucket(
                  userId,
                  title,
                  startDate,
                  bucket_response,
                  route.params.index,
                );
                navigation.goBack();
              }
            }
          }}>
          <Text style={[styles.buttonTextStyle, {fontSize: 15}]}>수정</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.InputView}>
        <TextInput
          placeholder={'제목을 작성해 주세요(45자 이내)'}
          style={styles.TextInputStyle}
          placeholderTextColor={Color.Silver}
          value={title}
          onChangeText={set_title}
          maxLength={50}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.InputView,
          {display: 'flex', flexDirection: 'row', alignItems: 'center'},
        ]}
        activeOpacity={0.6}
        onPress={() => {
          Keyboard.dismiss();
          modalizeRef.current?.open();
        }}>
        <Text style={styles.DateTextStyle}>{startDate}</Text>
      </TouchableOpacity>
      <View
        style={[
          styles.InputView,
          {
            height: 150,
          },
        ]}>
        <TextInput
          placeholder={'목표에 대한 설명을 간략히 해주세요(80자 이내)'}
          style={[
            styles.TextInputStyle,
            Platform.OS === 'ios' ? {marginTop: 5, marginBottom: 5} : {},
            {
              height: 150,
            },
          ]}
          placeholderTextColor={Color.Silver}
          multiline={true}
          value={bucket_response}
          onChangeText={set_bucket_response}
          maxLength={80}
        />
      </View>
    </SafeAreaView>
  );
}
