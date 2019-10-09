import React, { Component } from "react";
import { StyleSheet, View, Text, Image, Button } from "react-native";

export default class DetailInvitation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '2019-10-03',
      startTime: '12:00 AM',
      endTime: '3:00 AM',
      address: '68/87 TA20, Thoi An, Ho Chi Minh, Viet Nam',
      price: '30/h',
      Children: require("../assets/images/Baby-6.png"),
      nameChildren: 'Nam',
      Parent: require("../assets/images/Phuc.png"),
      nameParent: 'Phuc'
    }
  }
  render() {

    return (

      <View style={styles.root}>
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
            <Text style={styles.Invitation}>Invitation </Text>
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
            <Text style={styles.Children}>Children</Text>
          </View>
          <Image
            source={this.state.Children}
            resizeMode="stretch"
            style={styles.ChildrenPicture}
          />
          <Text style={styles.NameChildren}>{this.state.nameChildren} </Text>
          <Text style={styles.AgeChildren}>Age: 1 year old </Text>
          
          <Text style={styles.Parent}>Parent</Text>
          <Image
            source={this.state.Parent}
            resizeMode="stretch"
            style={styles.ParentPicture}
          />
          <Text style={styles.NameParent}>{this.state.nameParent}</Text>
          <View style={styles.container}>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Accept" />
            </View>
          </View>
        </View>

      </View>
    );
  }
}
DetailInvitation.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  Body: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Invitation: {
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
  Children: {
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
  AgeChildren: {
    color: "#121212",
    fontSize: 14,
    fontFamily: "muli",
    marginTop: 12,
    marginLeft: 45
  },
  Parent: {
    color: "#121212",
    fontSize: 30,
    fontFamily: "muli",
    marginTop: 17,
    marginLeft: 35,
    fontWeight: "bold"
  },
  ParentPicture: {
    width: 90,
    height: 82,
    borderRadius: 100,
    marginTop: 22,
    marginLeft: 44
  },
  NameParent: {
    color: "#121212",
    fontSize: 14,
    fontFamily: "muli",
    marginTop: 14,
    marginLeft: 75
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 150,
    marginRight: 150
  },
  buttonContainer: {
    width: '40%',
    height: 50,
    fontFamily: 'muli',
  }
});
