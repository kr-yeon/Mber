import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  BackHandler,
  ScrollView,
} from 'react-native';
import Color from '../../../Color';
import {FontName} from '../../../Font';

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
  text: {
    fontFamily: FontName.NotoSansKR,
    color: 'black',
    fontSize: 13,
  },
  scroll: {
    width: '95%',
  },
});

// @ts-ignore
export default function ({navigation, route}) {
  const info = route.params.info;

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
      <ScrollView style={styles.scroll}>
        <Text style={[styles.text, {marginTop: 10}]}>
          Library Name: {info.libraryName}
        </Text>
        <Text style={styles.text}>Version: {info.version}</Text>
        <Text style={styles.text}>License: {info._license}</Text>
        <Text style={[styles.text, {marginBottom: 10}]}>
          {'\n' + info._licenseContent}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
