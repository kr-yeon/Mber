import Color from '../Color';
import {BottomFabBar} from 'rn-wave-bottom-bar';
import React from 'react';

// @ts-ignore
export default function (props) {
  return (
    <BottomFabBar
      focusedButtonStyle={{
        shadowColor: Color.Black,
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.41,
        shadowRadius: 9.11,
        elevation: 14,
      }}
      bottomBarContainerStyle={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }}
      {...props}
    />
  );
}
