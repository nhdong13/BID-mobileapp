import React, { Component } from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';

import { MuliText } from 'components/StyledText';
import colors from 'assets/Color';

export default class MyNetwork extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ScrollView>
        <View style={{ marginTop: 35, marginLeft: 10 }}>
          <MuliText style={styles.headerTitle}>Mạng của tôi</MuliText>
          <MuliText style={styles.grayOptionInformation}>
            Vòng tròn tin tưởng của tôi
          </MuliText>
        </View>
        <View style={{ flexDirection: 'row', marginHorizontal: 15, marginTop: 25 }}>
          <View style={styles.netWorkContainer}>
            <View>
              <Image
                source={require('assets/images/login-family.png')}
                style={styles.profileImg}
              />
              <MuliText style={styles.headerTitle}>My friends</MuliText>
            </View>
          </View>
          <View style={styles.netWorkContainer}>
            <Image
              source={require('assets/images/login-family.png')}
              style={styles.profileImg}
            />
            <MuliText style={styles.headerTitle}>My sitters</MuliText>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginHorizontal: 15 }}>
          <View style={styles.netWorkContainer}>
            <Image
              source={require('assets/images/login-family.png')}
              style={styles.profileImg}
            />
            <MuliText style={styles.headerTitle}>My circles</MuliText>
          </View>
          <View style={styles.hide} />
        </View>
      </ScrollView>
    );
  }
}
MyNetwork.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  hide: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    height: 200,
    width: 200,
  },
  netWorkContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 15,
    height: 200,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 10,
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
    marginLeft: 10,
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
    width: 100,
    height: 100,
    overflow: 'hidden',
    marginTop: 10,
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
    fontWeight: '200',
    marginLeft: 10,
  },
});
