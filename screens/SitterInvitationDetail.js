import React, { Component } from "react";
import { StyleSheet, View, Text, Image } from "react-native";

export default class ParentDetail extends Component {
  render() {
    return (
      <View style={styles.root}>
        <View style={styles.Header} />
        <View style={styles.Body}>
          <View
            style={[
              styles.stack,
              {
                marginTop: 30,
                marginLeft: 71,
                height: 69,
                width: 137
              }
            ]}
          >
            <Text style={styles.Babysitting}>Babysit detail</Text>
          </View>
          <Text style={styles.Date}>Date: 2019-10-03</Text>
          <Text style={styles.StartTime}>Start time: 12:00 AM</Text>
          <Text style={styles.EndTime}>End time: 3:00 AM</Text>
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
              Address: {"\n"}68/87 TA20, Thoi An, Ho Chi Minh, Viet Nam
            </Text>
            <Text style={styles.Price}>
              Price: 30/h
            </Text>
            <Text style={styles.MyChildren}>My Children</Text>
          </View>
          <Image
            source={require("../assets/images/Phuc.png")}
            resizeMode="stretch"
            style={styles.ChildrenPicture}
          />
          <Text style={styles.NameChildren}>Nam</Text>
          <Text style={styles.MySitter}>My Sitter</Text>
          <Image
            source={require("../assets/images/Phuc.png")}
            resizeMode="stretch"
            style={styles.SitterPicture}
          />
          <Text style={styles.NameSitter}>Phuc</Text>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  Header: {
    backgroundColor: "rgba(23,169,211,1)",
  },
  Body: {
    backgroundColor: "rgba(230, 230, 230,1)",
    borderColor: "#000000",
    borderWidth: 1,
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    flex: 1,
    marginTop: 0
  },
  stack: {
    position: "relative"
  },
  Babysitting: {
    top: 0,
    left: -38,
    color: "#121212",
    fontSize: 30,
    fontFamily: "muli"
  },
  Detail: {
    top: 44,
    left: -36,
    color: "#121212",
    fontSize: 25,
    fontFamily: "muli"
  },
  Date: {
    color: "#121212",
    fontSize: 14,
    fontFamily: "muli",
    marginTop: 15,
    marginLeft: 35
  },
  StartTime: {
    color: "#121212",
    fontSize: 14,
    fontFamily: "muli",
    marginTop: 14,
    marginLeft: 35
  },
  EndTime: {
    color: "#121212",
    fontSize: 14,
    fontFamily: "muli",
    marginTop: 14,
    marginLeft: 35
  },
  Address: {
    top: 0,
    left: -37,
    color: "#121212",

    fontSize: 14,
    fontFamily: "muli"
  },
  Price: {
    top: 0,
    left: -37,
    color: "#121212",

    fontSize: 14,
    fontFamily: "muli"
  },
  MyChildren: {
    top: 46,
    left: -38,
    color: "#121212",
    fontSize: 25,
    fontFamily: "muli"
  },
  ChildrenPicture: {
    width: 90,
    height: 82,
    borderRadius: 100,
    marginTop: 100,
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
    fontSize: 25,
    fontFamily: "muli",
    marginTop: 17,
    marginLeft: 35
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
  }
});
