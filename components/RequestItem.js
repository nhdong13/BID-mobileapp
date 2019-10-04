import React from 'react';
import { Text } from 'react-native';

export function RequestItem(props) {
  return (
      <View {...props}>
          <Text {...props} style={[props.style, { fontFamily: 'muli' }]} />
      </View>
    
  );
}
