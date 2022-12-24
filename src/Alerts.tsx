import AwesomeAlerts from 'react-native-awesome-alerts';
import React from 'react';
import {StyleSheet} from 'react-native';
import {FontName} from './Font';
import Color from './Color';

const styles = StyleSheet.create({
  alert_text: {
    fontFamily: FontName.NotoSansKR,
    fontSize: 13,
    textAlign: 'center',
  },
});

export function NetworkAlert({
  status,
  set_status,
}: {
  status: boolean;
  set_status: Function;
}) {
  return (
    <AwesomeAlerts
      show={status}
      showProgress={false}
      title={'네트워크 연결을 확인해주세요'}
      message={
        '네트워크 연결이 불안정합니다.\n네트워크 연결을 확인해주시기 바랍니다.'
      }
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      showConfirmButton={true}
      confirmText={'확인'}
      confirmButtonColor={Color.ThemeColor}
      onConfirmPressed={() => set_status(false)}
      titleStyle={styles.alert_text}
      messageStyle={styles.alert_text}
      confirmButtonTextStyle={[styles.alert_text, {lineHeight: 26}]}
      confirmButtonStyle={{width: 80, height: 40}}
    />
  );
}

export function ErrorAlert({
  status,
  set_status,
}: {
  status: boolean;
  set_status: Function;
}) {
  return (
    <AwesomeAlerts
      show={status}
      showProgress={false}
      title={'에러가 발생했습니다'}
      message={'다시 시도해 주시길 바랍니다.'}
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      showConfirmButton={true}
      confirmText={'확인'}
      confirmButtonColor={Color.ThemeColor}
      onConfirmPressed={() => set_status(false)}
      titleStyle={styles.alert_text}
      messageStyle={styles.alert_text}
      confirmButtonTextStyle={[styles.alert_text, {lineHeight: 26}]}
      confirmButtonStyle={{width: 80, height: 40}}
    />
  );
}

export function DefaultAlert(props: any) {
  return (
    <AwesomeAlerts
      showProgress={false}
      closeOnTouchOutside={false}
      closeOnHardwareBackPress={false}
      confirmButtonColor={Color.ThemeColor}
      cancelButtonColor={Color.ThemeText}
      titleStyle={styles.alert_text}
      messageStyle={styles.alert_text}
      confirmButtonTextStyle={[styles.alert_text, {lineHeight: 26}]}
      cancelButtonTextStyle={[
        styles.alert_text,
        {lineHeight: 26, color: Color.Black},
      ]}
      confirmButtonStyle={{width: 80, height: 40}}
      cancelButtonStyle={{
        width: 80,
        height: 40,
        borderWidth: 1,
        borderColor: Color.Silver,
      }}
      {...props}
    />
  );
}
