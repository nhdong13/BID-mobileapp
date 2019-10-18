import React, { Component } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import moment from "moment";
import { MuliText } from "components/StyledText";
import { Ionicons } from "@expo/vector-icons";
import { createInvitation } from "api/invitation.api";
import images from "assets/images/images";
import colors from "assets/Color";

export default class Bsitter extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  calAge = dateOfBirth => {
    let born = this.getYear(dateOfBirth);
    let now = moment().year();
    return now - born;
  };

  getYear = dateOfBirth => {
    let arr = dateOfBirth.split("-");
    return arr[0];
  };

  sendInvitation = async receiverId => {
    const invitation = {
      requestId: this.props.requestId,
      status: "PENDING",
      receiver: receiverId
    };
    // console.log(invitation);
    await createInvitation(invitation)
      .then(res => {
        this.props.callBack(receiverId);
      })
      .catch(error => console.log(error));
  };

  render() {
    const { item } = this.props;
    return (
      <View key={item.userId} style={styles.bsitterContainer}>
        <View style={styles.bsitterItem}>
          <TouchableOpacity style={{ flexDirection: "row", flexGrow: 2 }}>
            <Image source={images.parent} style={styles.sitterImage} />
            <View>
              <View style={styles.upperText}>
                <MuliText style={styles.bsitterName}>
                  {item.user.nickname} - {this.calAge(item.user.dateOfBirth)}
                </MuliText>
                {item.user.gender == "MALE" && (
                  <Ionicons
                    name="ios-male"
                    size={20}
                    style={{ marginBottom: -2, marginLeft: 20 }}
                    color={colors.blueAqua}
                  />
                )}
                {item.user.gender == "FEMALE" && (
                  <Ionicons
                    name="ios-female"
                    size={20}
                    style={{ marginBottom: -2, marginLeft: 20 }}
                    color={colors.pinkLight}
                  />
                )}
              </View>
              <View style={styles.lowerText}>
                <Ionicons
                  name="ios-pin"
                  size={24}
                  style={{ marginBottom: -4, marginLeft: 20 }}
                  color={colors.lightGreen}
                />
                <MuliText> {item.distance} km </MuliText>
                <Ionicons
                  name="ios-star"
                  size={24}
                  style={{ marginBottom: -4, marginLeft: 20 }}
                  color={colors.lightGreen}
                />
                <MuliText> {item.averageRating} </MuliText>
              </View>
            </View>
          </TouchableOpacity>
          <View></View>
          {!item.isInvited && (
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={() => this.sendInvitation(item.userId)}
            >
              <MuliText style={{ color: "#78ddb6", fontSize: 16 }}>
                Invite
              </MuliText>
            </TouchableOpacity>
          )}
          {item.isInvited && (
            <MuliText style={{ color: "#B81A1A", fontSize: 16 }}>
              Invited
            </MuliText>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dfe6e9",
    paddingBottom: 20
  },
  textInput: {
    borderColor: "#EEEEEE",
    width: 300,
    height: 60,
    borderWidth: 2,
    borderRadius: 30,
    padding: 10,
    fontFamily: "muli"
  },
  sectionContainer: {
    backgroundColor: "white",
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10
  },
  headerSection: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#bdc3c7",
    height: 60,
    alignItems: "center",
    marginBottom: 15
  },
  bsitterContainer: {
    marginVertical: 13,
  },
  bsitterItem: {
    flexDirection: "row"
  },
  upperText: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginLeft: 15,
    flex: 1,
    alignItems: "center"
  },
  lowerText: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center"
  },
  submitButton: {
    width: 300,
    height: 60,
    padding: 10,
    backgroundColor: "#315F61",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  inviteButton: {
    marginTop: 10
  },
  inviteButtonDisable: {
    marginTop: 10,
    opacity: 0.7
  },
  bsitterName: {
    fontSize: 18,
    fontWeight: "400",
    color: "#315F61"
  },
  contentContainer: {
    paddingTop: 30
  },
  buttonContainer: {
    paddingTop: 30,
    alignItems: "center"
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },
  textContainer: {
    alignItems: "center",
    marginTop: 10
  },
  sitterImage: {
    width: 65,
    height: 65,
    borderRadius: 20,
    resizeMode: "contain"
  }
});
