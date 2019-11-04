import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { MuliText } from 'components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import colors from 'assets/Color';
import { withNavigation } from 'react-navigation';

export class CircleFriendSitter extends Component {
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
      <View key={item.id} style={styles.bsitterContainer}>
        <View style={styles.bsitterItem}>
          <TouchableOpacity style={{ flexDirection: 'row', flexGrow: 2 }}>
            <Image
              source={require('assets/images/Phuc.png')}
              style={styles.sitterImage}
            />
            <View>
              <View style={styles.upperText}>
                <MuliText style={styles.bsitterName}>
                  {item.user.nickname} - {this.calAge(item.user.dateOfBirth)}{' '}
                  tuổi
                </MuliText>
                {item.user.gender == 'MALE' && (
                  <Ionicons
                    name="ios-male"
                    size={20}
                    style={styles.icon}
                    color={colors.blueAqua}
                  />
                )}
                {item.user.gender == 'FEMALE' && (
                  <Ionicons
                    name="ios-female"
                    size={20}
                    style={styles.icon}
                    color={colors.pinkLight}
                  />
                )}
              </View>
              <View style={styles.lowerText}>
                <Ionicons
                  name="ios-pin"
                  size={24}
                  style={styles.icon}
                  color={colors.lightGreen}
                />
                <MuliText style={styles.bsitterName}> {item.distance} km </MuliText>
                <Ionicons
                  name="ios-star"
                  size={24}
                  style={styles.icon}
                  color={colors.lightGreen}
                />
                <MuliText style={styles.bsitterName}> {item.averageRating} </MuliText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default withNavigation(CircleFriendSitter);

const styles = StyleSheet.create({
  bsitterContainer: {
    marginVertical: 13,
  },
  bsitterItem: {
    flexDirection: 'row',
  },
  upperText: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginLeft: 15,
    flex: 1,
    alignItems: 'flex-start',
  },
  lowerText: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginLeft: 15,
    flex: 1,
    alignItems: 'flex-start',
  },
  icon: {
    marginBottom: -10,
  },
  bsitterName: {
    fontSize: 18,
    fontWeight: '400',
    color: '#315F61',
    marginRight: 10,
  },
  sitterImage: {
    width: 65,
    height: 65,
    borderRadius: 20,
    resizeMode: 'contain',
  },
});
