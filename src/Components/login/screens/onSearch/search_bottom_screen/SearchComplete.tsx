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
import {FontName} from '../../../../../Font';
import {getBottomSpace} from 'react-native-iphone-x-helper';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Context, {LoginContext} from '../../../../../Context';
import {Bucket} from '../../../../../DataTypes';
import {get_nick_doc, del_star, add_star} from '../../../../../DB';
import Color from '../../../../../Color';
import {SearchContext} from '../../../../../Context';

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

function BucketView(props: {
  index: number;
  title: string;
  date: string;
  response: string;
  like: Array<string>;
}) {
  const [res_unfold, set_res_unfold] = useState(false);
  const {userId, set_show_network_alert, isConnecting} = useContext(Context);
  const {search_data, userName} = useContext(SearchContext);

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
            style={{marginTop: 5}}
            onPress={async () => {
              if (!isConnecting) {
                set_show_network_alert(true);
              } else {
                const doc = await get_nick_doc(userName);
                // @ts-ignore
                const completed_buckets: Array<Bucket> = search_data.completed_buckets;
                if (props.like.includes(userId)) {
                  completed_buckets[props.index].like.splice(
                    completed_buckets[props.index].like.indexOf(userId),
                    1,
                  );
                  doc.update({completed_buckets: completed_buckets});
                } else {
                  completed_buckets[props.index].like.push(userId);
                  doc.update({completed_buckets: completed_buckets});
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
      {search_data.completed_buckets.length - 1 !== props.index ? (
        <View
          style={{width: '100%', height: 1, backgroundColor: Color.Silver}}
        />
      ) : null}
    </View>
  );
}

// @ts-ignore
export default function ({navigation}) {
  const {isConnecting, set_show_error_alert, set_show_network_alert, userId} =
    useContext(Context);
  const {userData} = useContext(LoginContext);
  const {search_data, set_search_data, userName} = useContext(SearchContext);
  const [refreshing, setRefreshing] = useState(false);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={navigation.goBack}>
          <Text style={styles.HeaderText}>뒤로</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.FixedButton}
        activeOpacity={0.7}
        onPress={() => {
          if (!isConnecting) {
            set_show_network_alert(true);
          } else {
            if (userData.stars.includes(userName)) {
              del_star(userId, userData.stars.indexOf(userName));
            } else {
              add_star(userId, userName);
            }
          }
        }}>
        {userData.stars.includes(userName) ? (
          <MaterialCommunityIcons name={'star'} color={Color.Star} size={22} />
        ) : (
          <MaterialCommunityIcons
            name={'star'}
            color={Color.ThemeText}
            size={22}
          />
        )}
      </TouchableOpacity>
      {search_data.completed_buckets.length === 0 ? (
        <TouchableOpacity
          style={[styles.FixedButton, {bottom: 152 + getBottomSpace()}]}
          activeOpacity={0.7}
          onPress={() =>
            update_data(
              isConnecting,
              userName,
              set_search_data,
              set_show_network_alert,
              set_show_error_alert,
            )
          }>
          <MaterialCommunityIcons
            name={'reload'}
            color={Color.ThemeText}
            size={22}
          />
        </TouchableOpacity>
      ) : null}
      {search_data.completed_buckets.length === 0 ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.NoBucketText}>
            {'완료된 버킷이 없네요.\n같이 버킷을 해보는건 어떨까요?'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={search_data.completed_buckets}
          renderItem={({item, index}) => (
            <BucketView
              index={index}
              title={item.title}
              date={item.date + ' ~' + item.complete_date}
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
                  userName,
                  set_search_data,
                  set_show_network_alert,
                  set_show_error_alert,
                );
                setRefreshing(false);
              }}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
