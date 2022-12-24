import React, {useContext, useState} from 'react';
import {
  FlatList,
  Keyboard,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {FontName} from '../../../Font';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Context, {LoginContext} from '../../../Context';
import {del_star, duplicate_check, get_data} from '../../../DB';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageKey} from '../../../StorageKey';
import {DefaultAlert} from '../../../Alerts';
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
  },
  input_view: {
    width: '95%',
    height: 45,
    backgroundColor: Color.WhiteSilver,
    borderRadius: 15,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 15,
  },
  text_input: {
    width: '85%',
    marginLeft: 10,
    fontFamily: FontName.NotoSansKR,
    fontSize: 12,
    color: Color.Black,
    height: 55,
  },
  star_text: {
    fontSize: 15,
    fontFamily: FontName.NotoSansKR,
    height: 29,
    lineHeight: 20,
    marginTop: 13,
    marginLeft: '5%',
    color: Color.Black,
  },
  star_view: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginLeft: 'auto',
    marginRight: '4%',
    marginTop: 7,
  },
  nick_close_view: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    height: 45,
  },
  nicks_text: {
    marginLeft: '5%',
    fontFamily: FontName.NotoSansKR,
    fontSize: 14,
    color: Color.Black,
  },
  flat_view: {
    flex: 1,
    marginBottom: 70,
  },
  close_icon_style: {
    marginLeft: 'auto',
    marginRight: '5%',
  },
  nicks_view: {
    flex: 1,
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

// @ts-ignore
export default function ({StackNavigation}) {
  const {userData, setUserData} = useContext(LoginContext);
  const {userId, isConnecting, set_show_error_alert, set_show_network_alert} =
    useContext(Context);
  const [star, set_star] = useState<boolean>(false);
  const [text, set_text] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [recent_search, set_recent_search] = useState<Array<string>>([]);
  const [length_zero_alert, set_length_zero_alert] = useState<boolean>(false);
  const [no_user_alert, set_no_user_alert] = useState<boolean>(false);
  const [show_easter_egg, set_show_easter_egg] = useState<boolean>(false);

  useState(() => {
    AsyncStorage.getItem(StorageKey.RecentSearch).then(s => {
      // @ts-ignore
      set_recent_search(JSON.parse(s));
    });
    // @ts-ignore
  }, []);

  function RefreshRecentSearch(nick: string) {
    const data = [nick, ...recent_search];

    if (data.length === 11) {
      delete data[10];
    }
    if (recent_search.includes(nick.trim())) {
      data.splice(data.lastIndexOf(nick.trim()), 1);
    }

    set_recent_search(data);
    AsyncStorage.setItem(StorageKey.RecentSearch, JSON.stringify(data));
  }

  function onNext(nick: string) {
    Keyboard.dismiss();
    if (nick === userData.nickname) {
      set_show_easter_egg(true);
      return;
    }
    if (!isConnecting) {
      set_show_network_alert(true);
      return;
    }
    if (nick.length === 0) {
      set_length_zero_alert(true);
      return;
    }
    duplicate_check(nick).then(s => {
      if (s) {
        RefreshRecentSearch(nick);
        StackNavigation.navigate('SearchUser', {name: nick});
      } else {
        set_no_user_alert(true);
      }
    });
  }

  function del_list(index: number) {
    if (star) {
      del_star(userId, index);
      update_data(
        isConnecting,
        userId,
        setUserData,
        set_show_network_alert,
        set_show_error_alert,
      );
    } else {
      const data = recent_search.filter((s, i) => i !== index);
      set_recent_search(data);
      AsyncStorage.setItem(StorageKey.RecentSearch, JSON.stringify(data));
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: Color.White}}>
      <DefaultAlert
        show={length_zero_alert}
        title={'닉네임을 입력해주세요'}
        message={'닉네임을 입력해주세요.'}
        showConfirmButton={true}
        confirmText={'확인'}
        onConfirmPressed={() => set_length_zero_alert(false)}
      />
      <DefaultAlert
        show={no_user_alert}
        title={'유저가 존재하지 않습니다.'}
        message={'닉네임을 확인해주세요.'}
        showConfirmButton={true}
        confirmText={'확인'}
        onConfirmPressed={() => set_no_user_alert(false)}
      />
      <DefaultAlert
        show={show_easter_egg}
        title={'나야나!'}
        message={'다른 친구들 닉네임을 검색해주세요 ㅠㅠ'}
        showConfirmButton={true}
        confirmText={'확인'}
        onConfirmPressed={() => set_show_easter_egg(false)}
      />
      <View style={styles.header}>
        <Text style={styles.HeaderText}>검색</Text>
      </View>
      <View style={styles.input_view}>
        <TextInput
          style={styles.text_input}
          placeholder={'검색할 사람의 닉네임을 입력해주세요.'}
          placeholderTextColor={Color.Silver}
          maxLength={20}
          value={text}
          returnKeyType={'go'}
          onChangeText={set_text}
          onSubmitEditing={e => {
            if (e.nativeEvent.text === text) {
              onNext(text.trim());
            }
          }}
        />
        <TouchableOpacity
          style={{width: '15%'}}
          activeOpacity={0.7}
          onPress={() => onNext(text.trim())}>
          <MaterialCommunityIcons
            name={'magnify'}
            size={30}
            color={Color.Black}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.star_view}>
        <Text style={styles.star_text}>
          {star ? '즐겨찾기' : '최근 검색한 닉네임'}
        </Text>
        <TouchableOpacity
          style={styles.star}
          activeOpacity={0.7}
          onPress={() => set_star(!star)}>
          <MaterialCommunityIcons
            name={'star'}
            size={30}
            color={star ? Color.Star : Color.Silver}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={star ? userData.stars : recent_search}
        renderItem={item => {
          return (
            <View style={styles.nick_close_view}>
              <TouchableOpacity
                style={styles.nicks_view}
                onPress={() => onNext(item.item.trim())}>
                <Text style={styles.nicks_text}>{item.item}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.close_icon_style}
                onPress={() => del_list(item.index)}>
                <MaterialCommunityIcons
                  name={'close'}
                  size={22}
                  color={Color.Silver}
                />
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item, index) => String(index)}
        style={styles.flat_view}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              if (star) {
                setRefreshing(true);
                update_data(
                  isConnecting,
                  userId,
                  setUserData,
                  set_show_network_alert,
                  set_show_error_alert,
                );
                setRefreshing(false);
              }
            }}
          />
        }
      />
    </View>
  );
}
