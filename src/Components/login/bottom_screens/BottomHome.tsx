import React, {useContext, useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import {FontName} from '../../../Font';
import {getBottomSpace} from 'react-native-iphone-x-helper';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Context, {BucketContext, LoginContext} from '../../../Context';
import {Bucket} from '../../../DataTypes';
import {RNToasty} from 'react-native-toasty';
import Clipboard from '@react-native-clipboard/clipboard';
import {get_data, get_document} from '../../../DB';
import Color from '../../../Color';

const styles = StyleSheet.create({
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
    textDecorationLine: 'underline',
    textDecorationColor: Color.ThemeText,
  },
  FixedButton: {
    zIndex: 1,
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: Color.ThemeColor,
    right: 20,
    bottom: 82 + getBottomSpace(),
    borderRadius: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  NoBucketText: {
    fontFamily: FontName.NotoSansKR,
    fontSize: 14,
    color: Color.Black,
    paddingBottom: '20%',
    textAlign: 'center',
  },
  bucket_view: {
    width: '100%',
    minHeight: 90,
    backgroundColor: Color.White,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bucket_index_view: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: Color.ThemeColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '2%',
  },
  bucket_index_text: {
    color: Color.ThemeText,
    fontFamily: FontName.NotoSansKR,
    fontSize: 13,
  },
  bucket_title: {
    color: Color.Black,
    fontFamily: FontName.NotoSansKR,
    fontSize: 13,
    marginLeft: '1.4%',
    lineHeight: 15,
    marginTop: 15,
    marginRight: '28%',
  },
  bucket_res: {
    color: Color.Silver,
    fontFamily: FontName.NotoSansKR,
    fontSize: 10.5,
    marginLeft: '1.4%',
    lineHeight: 12,
    marginTop: 5,
    marginBottom: 15,
    marginRight: '28%',
  },
});

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

function BucketView(props: {
  index: number;
  title: string;
  date: string;
  response: string;
  like: Array<string>;
}) {
  const [res_unfold, set_res_unfold] = useState(false);
  const {modalFun, modalizeRef} = useContext(BucketContext);
  const {userId, set_show_network_alert, isConnecting} = useContext(Context);
  const {userData} = useContext(LoginContext);

  return (
    <View>
      <View style={styles.bucket_view}>
        <View style={styles.bucket_index_view}>
          <Text style={styles.bucket_index_text}>{props.index + 1}</Text>
        </View>
        <View
          style={{
            marginLeft: '2%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <Text
            style={[
              styles.bucket_title,
              props.response.length === 0 ? {marginTop: 15} : {},
            ]}>
            {props.title}
          </Text>
          <Text
            style={[
              styles.bucket_res,
              {
                marginTop: 1,
                marginBottom: props.response.length === 0 ? 15 : -1,
              },
            ]}>
            {props.date}
          </Text>
          {props.response.length === 0 ? null : (
            <Text
              style={styles.bucket_res}
              onPress={() => set_res_unfold(!res_unfold)}
              numberOfLines={res_unfold ? 90 : 1}
              ellipsizeMode={'tail'}>
              {props.response}
            </Text>
          )}
        </View>
        <View
          style={{
            marginLeft: 'auto',
            marginRight: '3%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              modalFun(props.index);
              modalizeRef.current.open();
            }}>
            <MaterialCommunityIcons name={'dots-vertical'} size={24} color={Color.Black} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{marginTop: 5}}
            onPress={() => {
              if (!isConnecting) {
                set_show_network_alert(true);
              } else {
                const doc = get_document(userId);
                // @ts-ignore
                const buckets: Array<Bucket> = userData.buckets;
                if (props.like.includes(userId)) {
                  buckets[props.index].like.splice(
                    buckets[props.index].like.indexOf(userId),
                    1,
                  );
                  doc.update({buckets: buckets});
                } else {
                  buckets[props.index].like.push(userId);
                  doc.update({buckets: buckets});
                }
              }
            }}>
            {props.like.includes(userId) ? (
              <MaterialCommunityIcons
                name={'heart'}
                size={24}
                color={Color.Red}
              />
            ) : (
              <MaterialCommunityIcons
                name={'heart-outline'}
                size={24}
                color={Color.Black}
              />
            )}
            <Text
              style={{
                fontFamily: FontName.NotoSansKR,
                fontSize: 10,
                lineHeight: 10,
                textAlign: 'center',
                color: Color.Silver,
              }}>
              {props.like.length}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {userData.buckets.length - 1 !== props.index ? (
        <View
          style={{width: '100%', height: 1, backgroundColor: Color.Silver}}
        />
      ) : null}
    </View>
  );
}

// @ts-ignore
export default function ({StackNavigation, setModalNum, modalizeRef}) {
  const {userId, isConnecting, set_show_error_alert, set_show_network_alert} =
    useContext(Context);
  const {userData, setUserData} = useContext(LoginContext);
  const [refreshing, setRefreshing] = useState(false);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.White}}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Clipboard.setString(userData.nickname);
            RNToasty.Normal({
              title: '닉네임이 복사되었습니다.',
              fontFamily: FontName.NotoSansKR + '.otf',
              position: 'center',
            });
          }}
          activeOpacity={0.7}>
          <Text style={styles.HeaderText}>{userData.nickname}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginLeft: 'auto', marginRight: 16}}
          onPress={() => StackNavigation.navigate('SettingScreen')}>
          <MaterialCommunityIcons
            name={'cog-outline'}
            color={Color.ThemeText}
            size={23}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.FixedButton}
        activeOpacity={0.7}
        onPress={() => StackNavigation.navigate('WriteBucketScreen')}>
        <MaterialCommunityIcons
          name={'pencil-plus'}
          color={Color.ThemeText}
          size={22}
        />
      </TouchableOpacity>
      {userData.buckets.length === 0 ? (
        <TouchableOpacity
          style={[styles.FixedButton, {bottom: 152 + getBottomSpace()}]}
          activeOpacity={0.7}
          onPress={() =>
            update_data(
              isConnecting,
              userId,
              setUserData,
              set_show_network_alert,
              set_show_error_alert,
            )
          }>
          <MaterialCommunityIcons name={'reload'} color={'white'} size={22} />
        </TouchableOpacity>
      ) : null}
      {userData.buckets.length === 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.NoBucketText}>
            {
              '새로운 버킷을 작성해보세요!\n이미 버킷이 있다면 새로고침을 해주세요.'
            }
          </Text>
        </View>
      ) : (
        <BucketContext.Provider
          value={{
            modalFun: setModalNum,
            modalizeRef: modalizeRef,
          }}>
          <FlatList
            data={userData.buckets}
            renderItem={({item, index}) => (
              <BucketView
                index={index}
                title={item.title}
                date={item.date + ' ~'}
                response={item.res}
                like={item.like}
              />
            )}
            style={{
              marginBottom: 70,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  update_data(
                    isConnecting,
                    userId,
                    setUserData,
                    set_show_network_alert,
                    set_show_error_alert,
                  );
                  setRefreshing(false);
                }}
              />
            }
          />
        </BucketContext.Provider>
      )}
    </SafeAreaView>
  );
}
