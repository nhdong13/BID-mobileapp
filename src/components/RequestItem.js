import React from 'react';
import { Text, View } from 'react-native';

export default function RequestItem(props) {
  return (
    <View {...props}>
      <Text {...props} style={[props.style, { fontFamily: 'muli' }]} />
    </View>
  );
}
