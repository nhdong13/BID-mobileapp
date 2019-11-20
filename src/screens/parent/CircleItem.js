import React, { Component } from 'react';
import { Image, View } from 'react-native';
import moment from 'moment';
import { MuliText } from 'components/StyledText';
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
          marginHorizontal: 20,
          marginVertical: 10,
        }}
      >
        <Image
          source={require('assets/images/Phuc.png')}
          style={{
            opacity: null,
            width: 60,
            height: 60,
            marginBottom: 5,
            borderRadius: 60 / 2,
            overflow: 'hidden',
          }}
        />
        <View>
          <MuliText
            style={{
              color: 'black',
              fontSize: 11,
            }}
          >
            {item.friend.user.nickname}
          </MuliText>
        </View>
      </View>
    );
  }
}

export default withNavigation(CircleItem);
