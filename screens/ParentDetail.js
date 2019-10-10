import React, { Component } from "react";
import { StyleSheet, View, Text, Image, Button, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons/';
import { MuliText } from "../components/StyledText";
import moment from 'moment';


export default class ParentDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '2019-10-03',
      startTime: '12:00 AM',
      endTime: '3:00 AM',
      address: '68/87 TA20, Thoi An, Ho Chi Minh, Viet Nam',
      price: '30/H',
      detailPictureChildren: require("../assets/images/Baby-6.png"),
      nameChildren: 'Nam',
      detailPictureSitter: require("../assets/images/Phuc.png"),
      nameSitter: 'Phuc'
    }
  }


  render() {
    return (

      <ScrollView>
        <View style={styles.detailInformationContainer}>
          <View style={styles.textAndDayContainer}>
            <View style={styles.informationText}>
              <Ionicons
                name='ios-calendar'
                size={26}
                style={{ marginBottom: -3 }}
                color='#555555'
              />
              <MuliText style={styles.contentInformation}>{moment(this.state.date).format('dddd Do MMMM')}</MuliText>
            </View>
            <View style={styles.priceText}>
              <Ionicons
                name='ios-cash'
                size={26}
                style={{ marginBottom: -3 }}
                color='#555555'
              />
              <MuliText style={styles.contentInformation}>{this.state.price}</MuliText>
            </View>

          </View>
          <View style={styles.informationText}>
            <Ionicons
              name='ios-timer'
              size={26}
              style={{ marginBottom: -3 }}
              color='#555555'
            />
            <MuliText style={styles.contentInformation}>{this.state.startTime} - {this.state.endTime}</MuliText>
          </View>
          <View style={styles.informationText}>
            <Ionicons
              name='ios-home'
              size={26}
              style={{ marginBottom: -3 }}
              color='#555555'
            />
            <MuliText style={styles.contentInformation}>{this.state.address}</MuliText>
          </View>
        </View>
        <View style={styles.detailContainer}>
          <MuliText style={styles.detailText}>CHILDREN</MuliText>
          <View style={styles.detailPictureContainer}>
            <View >
              <Image source={this.state.detailPictureChildren} style={styles.profileImg} ></Image>
              <View style={styles.name}>
                <MuliText >{this.state.nameChildren}</MuliText>
              </View>
            </View>
            <View >
              <Image source={this.state.detailPictureChildren} style={styles.profileImg} ></Image>
              <View style={styles.name}>
                <MuliText >{this.state.nameChildren}</MuliText>
              </View>
            </View>
            <View >
              <Image source={this.state.detailPictureChildren} style={styles.profileImg} ></Image>
              <View style={styles.name}>
                <MuliText >{this.state.nameChildren}</MuliText>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.detailOptionsContainer}>
          <MuliText style={styles.optionsText}>OPTIONS</MuliText>
          <View style={styles.optionText}>
            <Ionicons
              name='ios-cash'
              size={35}
              style={{ marginBottom: -3 }}
              color='#555555'
            />
            <View>
              <MuliText style={styles.optionInformation}>Payment by Credit card</MuliText>
              <MuliText style={styles.grayOptionInformation}>Card payment depends on sitter</MuliText>
            </View>
          </View>
          <View style={styles.optionText}>
            <Ionicons
              name='ios-car'
              size={35}
              style={{ marginBottom: -3 }}
              color='#555555'
            />
            <View>
              <MuliText style={styles.optionInformation}>The Sitter does not have a car</MuliText>
              <MuliText style={styles.grayOptionInformation}>I will take the Sitter home</MuliText>
            </View>
          </View>
          <View style={styles.optionText}>
            <Ionicons
              name='ios-text'
              size={35}
              style={{ marginBottom: -3 }}
              color='#555555'
            />
            <View>
              <MuliText style={styles.optionInformation}>VietNamese</MuliText>
              <MuliText style={styles.grayOptionInformation}>I want the Sitter to speak one of these languages natively</MuliText>
            </View>
          </View>
          <View style={styles.optionText}>
            <Ionicons
              name='ios-man'
              size={35}
              style={{ marginBottom: -3 }}
              color='#555555'
            />
            <View>
              <MuliText style={styles.optionInformation}>Complementary insurance</MuliText>
              <MuliText style={styles.grayOptionInformation}>You didn't take the complementary insurance</MuliText>
            </View>
          </View>
        </View>
        <View style={styles.detailContainer}>
          <MuliText style={styles.detailText}>MY SITTER</MuliText>
          <View style={styles.detailPictureContainer}>
            <View>
              <Image source={this.state.detailPictureSitter} style={styles.profileImg} ></Image>
              <View style={styles.name}>
                <MuliText >{this.state.nameSitter}</MuliText>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Press me"
            color="#f194ff"
          />
          <Button
            title="Press me"
            color="#f194ff"
          />
        </View>
      </ScrollView>
    );
  }
}
ParentDetail.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 200,
    marginRight: 200,
    marginBottom: 50
  },
  detailPictureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    alignItems: "center",
  },
  detailText: {
    fontSize: 25,
    color: "gray",
    marginBottom: 10,
    fontWeight: 'bold'
  },
  optionsText: {
    fontSize: 25,
    color: "gray",
    fontWeight: 'bold',
    marginLeft: 40,
  },
  profileImg: {
    marginTop: 20,
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "black"
  },
  detailContainer: {
    margin: 30,
    //  backgroundColor: 'red',
  },
  textAndDayContainer: {
    flexDirection: 'row'
  },
  priceText: {
    fontSize: 20,
    marginLeft: 150,
    marginTop: 30,
    flexDirection: 'row',
  },
  detailInformationContainer: {
    flex: 1,
    marginTop: 40,
  },
  detailOptionsContainer: {
    flex: 1,
    marginTop: 20,
  },
  informationText: {
    fontSize: 20,
    marginLeft: 50,
    marginTop: 30,
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  optionText: {
    fontSize: 20,
    marginLeft: 50,
    marginTop: 30,
    flexDirection: 'row',
  },
  contentInformation: {
    fontSize: 20,
    paddingLeft: 20,
  },
  optionInformation: {
    marginTop: 7,
    fontSize: 20,
    paddingLeft: 20,
  },
  grayOptionInformation: {
    color: 'gray',
    fontSize: 20,
    paddingLeft: 20,
  },
});
