import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { MuliText } from 'components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import { CheckBox } from 'native-base';
import images from 'assets/images/images';
import colors from 'assets/Color';
import { withNavigation } from 'react-navigation';

export class CircleItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  calAge = (dateOfBirth) => {
    const born = this.getYear(dateOfBirth);
    const now = moment().year();
    return now - born;
  };

  getYear = (dateOfBirth) => {
    const arr = dateOfBirth.split('-');
    return arr[0];
  };

  render() {
    const { item } = this.props;
    return (
      <View
        key={item.userId}
        style={{
          alignItems: 'center',
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        <Image
          source={require('assets/images/Phuc.png')}
          style={{
            opacity: null,
            width: 80,
            height: 80,
            marginBottom: 5,
            borderRadius: 120 / 2,
            overflow: 'hidden',
          }}
        />
        <View>
          <MuliText
            style={{
              color: 'black',
            }}
          >
            {item.friend.user.nickname}
          </MuliText>

          {/* <CheckBox
            style={{
              marginTop: 5,
              width: 18,
              height: 18,
              borderRadius: 20 / 2,
              borderColor: 'black',
              backgroundColor: 'black',
            }}
            checked={true}
          /> */}
        </View>
      </View>
    );
  }
}

export default withNavigation(CircleItem);

const styles = StyleSheet.create({});
