import React, { Component } from 'react';
import { Image, View } from 'react-native';
import moment from 'moment';
import { MuliText } from 'components/StyledText';
import { withNavigation } from 'react-navigation';
import colors from 'assets/Color';

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
              color: colors.darkGreenTitle,
              fontSize: 14,
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
