import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { MuliText } from 'components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import colors from 'assets/Color';
import { withNavigation } from 'react-navigation';

export class CircleHiredSitter extends Component {
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
    // console.log('PHUC: CircleHiredSitter -> render -> item', item);
    return (
      <View key={item.id} style={styles.bsitterContainer}>
        <View style={styles.bsitterItem}>
          <TouchableOpacity style={{ flexDirection: 'row', flexGrow: 2 }}>
            <Image
              source={{ uri: item.user.image }}
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
                    color={colors.pinkLight}
                  />
                )}
              </View>
              <View style={styles.lowerText}>
                <Ionicons name="ios-star" size={24} color={colors.lightGreen} />
                <MuliText style={styles.bsitterName}>
                  {' '}
                  {item.averageRating.toFixed(0)}{' '}
                </MuliText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default withNavigation(CircleHiredSitter);

const styles = StyleSheet.create({
  bsitterContainer: {
    marginVertical: 8,
    marginLeft: 10,
  },
  bsitterItem: {
    flexDirection: 'row',
  },
  upperText: {
    marginTop: 10,
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
  bsitterName: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.darkGreenTitle,
    marginRight: 5,
  },
  sitterImage: {
    width: 80,
    height: 80,
    borderRadius: 160 / 2,
    overflow: 'hidden',
  },
});
