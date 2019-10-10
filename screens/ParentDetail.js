import React, { Component } from "react";
import { StyleSheet, View, Text, Image, Button, ScrollView } from "react-native";
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
      price: '30/h',
      myChildren: require("../assets/images/Baby-6.png"),
      nameChildren: 'Nam',
      mySitter: require("../assets/images/Phuc.png"),
      nameSitter: 'Phuc'
    }
  }


  render() {
    return (

      <ScrollView>
        <View style={styles.centerContainer}>
          <View style={styles.informationText}>
            <Ionicons
              name='ios-calendar'
              size={26}
              style={{ marginBottom: -3 }}
              color='#555555'
            />
            <MuliText style={styles.contentInformation}>{moment(this.state.date).format('dddd Do MMMM')}</MuliText>
          </View>
        </View>
        <View style={styles.Body}>
          <View
            style={[
              styles.stack,
              {
                marginTop: 50,
                marginLeft: 71,
                height: 100,
                width: 300
              }
            ]}
          >
            <Text style={styles.Babysitting}>Babysitting </Text>
            <Text style={styles.Detail}>Detail </Text>
          </View>
          <Text style={styles.Date}>Date: {this.state.date}</Text>
          <Text style={styles.StartTime}>Start time: {this.state.startTime}</Text>
          <Text style={styles.EndTime}>End time: {this.state.endTime}</Text>
          <View
            style={[
              styles.stack,
              {
                marginTop: 17,
                marginLeft: 72,
                height: 71,
                width: 293
              }
            ]}
          >
            <Text style={styles.Address}>
              Address: {"\n"} {this.state.address}
            </Text>
            <Text style={styles.Price}>
              Price: {this.state.price}
            </Text>
            <Text style={styles.MyChildren}>My Children</Text>
          </View>
          <Image
            source={this.state.myChildren}
            resizeMode="stretch"
            style={styles.ChildrenPicture}
          />
          <Text style={styles.NameChildren}>{this.state.nameChildren}</Text>
          <Text style={styles.MySitter}>My Sitter</Text>
          <Image
            source={this.state.mySitter}
            resizeMode="stretch"
            style={styles.SitterPicture}
          />
          <Text style={styles.NameSitter}>{this.state.nameSitter}</Text>
          <View style={styles.container}>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Confirm" />
            </View>
          </View>
        </View>

      </ScrollView>
    );
  }
}
ParentDetail.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    marginTop: 40,
  },
  informationText: {
    marginLeft: 30,
    marginTop: 15,
    flexDirection: 'row',
    // backgroundColor: 'red',
  },
  contentInformation: {
    paddingLeft: 20,
  },
  Body: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Babysitting: {
    top: 0,
    left: -38,
    color: "#121212",
    fontSize: 50,
    fontFamily: "muli",
    fontWeight: 'bold',
  },
  Detail: {
    left: -36,
    color: "#121212",
    fontSize: 30,
    fontFamily: "muli",
    fontWeight: 'bold',
  },
  Date: {
    color: "#121212",
    fontSize: 20,
    fontFamily: "muli",
    marginTop: 15,
    marginLeft: 35
  },
  StartTime: {
    color: "#121212",
    fontSize: 20,
    fontFamily: "muli",
    marginTop: 14,
    marginLeft: 35
  },
  EndTime: {
    color: "#121212",
    fontSize: 20,
    fontFamily: "muli",
    marginTop: 14,
    marginLeft: 35
  },
  Address: {
    top: 0,
    left: -37,
    color: "#121212",

    fontSize: 20,
    fontFamily: "muli"
  },
  Price: {
    top: 0,
    left: -37,
    color: "#121212",

    fontSize: 20,
    fontFamily: "muli"
  },
  MyChildren: {
    top: 20,
    left: -38,
    color: "#121212",
    fontSize: 30,
    fontFamily: "muli",
    fontWeight: "bold"
  },
  ChildrenPicture: {
    width: 90,
    height: 82,
    borderRadius: 100,
    marginTop: 120,
    marginLeft: 42
  },
  NameChildren: {
    color: "#121212",
    fontSize: 14,
    fontFamily: "muli",
    marginTop: 12,
    marginLeft: 72
  },
  MySitter: {
    color: "#121212",
    fontSize: 30,
    fontFamily: "muli",
    marginTop: 17,
    marginLeft: 35,
    fontWeight: "bold"
  },
  SitterPicture: {
    width: 90,
    height: 82,
    borderRadius: 100,
    marginTop: 22,
    marginLeft: 44
  },
  NameSitter: {
    color: "#121212",
    fontSize: 14,
    fontFamily: "muli",
    marginTop: 14,
    marginLeft: 75
  },
  container: {
    flex: 1,
  },
  buttonContainer: {
    width: '40%',
    height: 50,
    fontFamily: 'muli',
  }
});
