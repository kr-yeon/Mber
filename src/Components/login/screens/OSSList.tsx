import React, {useEffect} from 'react';
import {
  BackHandler,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  FlatList,
} from 'react-native';
import Color from '../../../Color';
import {FontName} from '../../../Font';
import OSS from '../../../OSS.json';

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
    height: 55,
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
  function LicenseView(props: {info: any; index: number}) {
    return (
      <View>
        <TouchableOpacity
          style={styles.TouchButton}
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('OSSInfo', {info: props.info});
          }}>
          <Text style={styles.TouchText}>{props.info.libraryName}</Text>
          <Text>{}</Text>
        </TouchableOpacity>
        {props.index !== OSS.length - 1 ? <View style={styles.line} /> : null}
      </View>
    );
  }

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
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.6}>
          <Text style={styles.HeaderText}>이전</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={OSS}
        renderItem={({item, index}) => {
          return <LicenseView info={item} index={index} />;
        }}
      />
    </SafeAreaView>
  );
}
