import React, {useContext, useRef, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import BottomHome from './bottom_screens/BottomHome';
import CompleteBuckets from './bottom_screens/CompleteBuckets';
import Search from './bottom_screens/Search';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getBottomSpace} from 'react-native-iphone-x-helper';
import {Modalize} from 'react-native-modalize';
import {FontName} from '../../Font';
import Context from '../../Context';
import {UserData} from '../../DataTypes';
import {DefaultAlert} from '../../Alerts';
import {
  cancel_complete_bucket,
  complete_bucket,
  del_bucket,
  del_completed_bucket,
  get_data,
} from '../../DB';
import Color from '../../Color';
import TabBar from '../TabBar';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 55,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button_text: {
    fontFamily: FontName.NotoSansKR,
    fontSize: 13,
    lineHeight: 18,
    color: Color.Black,
  },
  line: {
    width: '90%',
    backgroundColor: Color.Silver,
    height: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

// @ts-ignore
export default function ({navigation}) {
  const {isConnecting, set_show_network_alert, userId} = useContext(Context);
  const modalizeRef = useRef(null);
  const modalizeRef2 = useRef(null);
  const [modalNum, setModalNum] = useState<number>(-1);
  const [modalNum2, setModalNum2] = useState<number>(-1);
  const [show_del_alert, set_show_del_alert] = useState<boolean>(false);
  const [show_complete_alert, set_show_compete_alert] =
    useState<boolean>(false);
  const [show_del_alert2, set_show_del_alert2] = useState<boolean>(false);
  const [show_complete_cancel_alert, set_show_complete_cancel_alert] =
    useState<boolean>(false);

  return (
    <View style={{flex: 1}}>
      <Modalize ref={modalizeRef} adjustToContentHeight={true}>
        <TouchableOpacity
          style={[styles.button, {marginTop: 10}]}
          activeOpacity={0.4}
          onPress={() => {
            // @ts-ignore
            modalizeRef.current.close();
            if (!isConnecting) {
              set_show_network_alert(true);
            } else {
              set_show_compete_alert(true);
            }
          }}>
          <Text style={styles.button_text}>완료하기</Text>
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.4}
          onPress={() => {
            async function EditBucket() {
              const data: UserData = await get_data(userId);
              const buckets = data.buckets;

              // @ts-ignore
              modalizeRef.current.close();
              navigation.navigate('EditBucketScreen', {
                title: buckets[modalNum].title,
                date: buckets[modalNum].date,
                res: buckets[modalNum].res,
                index: modalNum,
              });
            }

            EditBucket();
          }}>
          <Text style={styles.button_text}>수정하기</Text>
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.4}
          onPress={() => {
            // @ts-ignore
            modalizeRef.current.close();
            if (!isConnecting) {
              set_show_network_alert(true);
            } else {
              set_show_del_alert(true);
            }
          }}>
          <Text style={[styles.button_text, {color: Color.Red}]}>삭제하기</Text>
        </TouchableOpacity>
        <View style={{height: getBottomSpace() + 10}} />
      </Modalize>
      <Modalize ref={modalizeRef2} adjustToContentHeight={true}>
        <TouchableOpacity
          style={[styles.button, {marginTop: 10}]}
          activeOpacity={0.4}
          onPress={() => {
            // @ts-ignore
            modalizeRef2.current.close();
            if (!isConnecting) {
              set_show_network_alert(true);
            } else {
              set_show_complete_cancel_alert(true);
            }
          }}>
          <Text style={styles.button_text}>취소하기</Text>
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.4}
          onPress={() => {
            // @ts-ignore
            modalizeRef2.current.close();
            if (!isConnecting) {
              set_show_network_alert(true);
            } else {
              set_show_del_alert2(true);
            }
          }}>
          <Text style={[styles.button_text, {color: Color.Red}]}>삭제하기</Text>
        </TouchableOpacity>
        <View style={{height: getBottomSpace() + 10}} />
      </Modalize>
      <DefaultAlert
        show={show_complete_alert}
        title={'버킷 완료'}
        message={'정말 이 버킷을 완료하시겠습니까?'}
        showConfirmButton={true}
        showCancelButton={true}
        confirmText={'확인'}
        cancelText={'취소'}
        onConfirmPressed={() => {
          complete_bucket(userId, modalNum);
          set_show_compete_alert(false);
        }}
        onCancelPressed={() => set_show_compete_alert(false)}
      />
      <DefaultAlert
        show={show_del_alert}
        title={'버킷 삭제'}
        message={'정말 이 버킷을 삭제하시겠습니까?'}
        showConfirmButton={true}
        showCancelButton={true}
        confirmText={'확인'}
        cancelText={'취소'}
        onConfirmPressed={() => {
          del_bucket(userId, modalNum);
          set_show_del_alert(false);
        }}
        onCancelPressed={() => set_show_del_alert(false)}
      />
      <DefaultAlert
        show={show_complete_cancel_alert}
        title={'버킷 취소'}
        message={'정말 완료된 버킷을 취소 하시겠습니까?'}
        showConfirmButton={true}
        showCancelButton={true}
        confirmText={'확인'}
        cancelText={'취소'}
        onConfirmPressed={() => {
          cancel_complete_bucket(userId, modalNum2);
          set_show_complete_cancel_alert(false);
        }}
        onCancelPressed={() => set_show_complete_cancel_alert(false)}
      />
      <DefaultAlert
        show={show_del_alert2}
        title={'버킷 삭제'}
        message={'정말 이 버킷을 삭제하시겠습니까?'}
        showConfirmButton={true}
        showCancelButton={true}
        confirmText={'확인'}
        cancelText={'취소'}
        onConfirmPressed={() => {
          del_completed_bucket(userId, modalNum2);
          set_show_del_alert2(false);
        }}
        onCancelPressed={() => set_show_del_alert2(false)}
      />
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
          children={props => (
            <BottomHome
              StackNavigation={navigation}
              setModalNum={setModalNum}
              modalizeRef={modalizeRef}
              {...props}
            />
          )}
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
          name={'Search'}
          children={props => <Search StackNavigation={navigation} {...props} />}
          options={{
            tabBarIcon: ({size}) => (
              <MaterialCommunityIcons
                name={'magnify'}
                size={size}
                color={Color.ThemeText}
              />
            ),
          }}
        />
        <Tab.Screen
          name={'CompleteBuckets'}
          children={props => (
            <CompleteBuckets
              setModalNum={setModalNum2}
              modalizeRef={modalizeRef2}
              {...props}
            />
          )}
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
    </View>
  );
}
