import React, { Component } from 'react';
import { Image, View } from 'react-native';
import moment from 'moment';
import { MuliText } from 'components/StyledText';
import { withNavigation } from 'react-navigation';
import colors from 'assets/Color';

export class CircleSisterItem extends Component {
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
      <View>
        {!item.isParent ? (
          <View
            key={item.id}
            style={{
              alignItems: 'center',
              marginHorizontal: 10,
              marginVertical: 10,
            }}
          >
            <Image
              source={{ uri: item.image }}
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
                {item.nickname}
              </MuliText>
            </View>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    );
  }
}

export default withNavigation(CircleSisterItem);
