import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TextInput,
  // TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons/';
import { MuliText } from 'components/StyledText';
import moment from 'moment';
import Api from 'api/api_helper';
import colors from 'assets/Color';
import { Button } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default class ReportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <View
          style={{
            width: SCREEN_WIDTH,
            height: 0,
            borderTopColor: colors.done,
            borderTopWidth: SCREEN_HEIGHT / 4,
            borderRightWidth: SCREEN_WIDTH,
            borderRightColor: colors.done,
            position: 'absolute',
            alignItems: 'center',
          }}
        />
        <View style={{ alignItems: 'center' }}>
          <Image
            source={require('assets/images/Phuc.png')}
            style={{
              width: 120,
              height: 120,
              marginTop: SCREEN_HEIGHT / 5,
              borderRadius: 120 / 2,
              overflow: 'hidden',
              borderWidth: 2,
              borderColor: 'black',
            }}
          />
          <MuliText style={{ fontWeight: 'bold', fontSize: 25 }}>Ky</MuliText>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity>
              <Ionicons
                name="ios-star"
                size={24}
                style={{ marginBottom: -4 }}
                color={colors.lightGreen}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="ios-star"
                size={24}
                style={{ marginBottom: -4 }}
                color={colors.lightGreen}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="ios-star"
                size={24}
                style={{ marginBottom: -4 }}
                color={colors.lightGreen}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="ios-star"
                size={24}
                style={{ marginBottom: -4 }}
                color={colors.lightGreen}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="ios-star"
                size={24}
                style={{ marginBottom: -4 }}
                color={colors.lightGreen}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 10,
              borderWidth: 2,
              width: 300,
              height: 300,
              marginHorizontal: 15,
            }}
          >
            <TextInput style={{ paddingHorizontal: 15 }} />
          </View>
          <TouchableOpacity>
            <Button
              style={{
                marginTop: 15,
                borderColor: 'black',
                borderWidth: 1,
                width: 100,
                backgroundColor: 'white',
              }}
            ></Button>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
ReportScreen.navigationOptions = {
  title: 'Report Screen',
};

const styles = StyleSheet.create({
  name: {
    alignItems: 'center',
  },
  detailPictureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textReview: {
    marginLeft: 8,
    marginRight: 100,
    flex: 1,
  },
  line: {
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    marginTop: 10,
    marginHorizontal: 25,
  },
  reivewContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  nameReview: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#315F61',
  },
  optionInformation: {
    color: '#bdc3c7',
    fontSize: 13,
    paddingLeft: 15,
    fontWeight: '400',
  },
  textOption: {
    marginHorizontal: 5,
  },
  informationText: {
    fontSize: 13,
    marginTop: 20,
    flexDirection: 'row',
    color: '#bdc3c7',
    // backgroundColor: 'red',
  },
  headerTitle: {
    fontSize: 15,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800',
  },
  detailContainer: {
    marginHorizontal: 25,
    marginTop: 20,
  },
  profileImg2: {
    width: 60,
    height: 70,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 1,
    marginLeft: 10,
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 140 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
  },
  childrenInformationContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
    borderRadius: 15,
    height: 100,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 1,
  },
  grayOptionInformation: {
    color: '#bdc3c7',
    fontSize: 11,
    paddingLeft: 15,
    fontWeight: '200',
    marginTop: 10,
  },
});
