import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons/";
import { MuliText } from "components/StyledText";
import moment from "moment";
import Api from "api/api_helper";
import images from "assets/images/images";
import colors from "assets/Color";
import { listByRequestAndStatus } from "api/invitation.api";
import { acceptBabysitter, cancelRequest } from "api/sittingRequest.api";
export default class RequestDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sittingRequestsID: this.props.navigation.state.params.requestId,
      date: null,
      startTime: null,
      endTime: null,
      address: null,
      price: "30/H",
      detailPictureChildren: require("assets/images/Baby-6.png"),
      nameChildren: "Nam",
      detailPictureSitter: require("assets/images/Phuc.png"),
      nameSitter: null,
      bsitter: null,
      status: null,
      invitations: [],
      childrenNumber: 1,
      minAgeOfChildren: 1,
    };
  }

  getAcceptedInvitations = async () => {
    let data = await listByRequestAndStatus(
      this.state.sittingRequestsID,
      "ACCEPTED"
    );

    this.setState({
      invitations: data
    });

  };

  acceptBabysitter = async sitterId => {
    await acceptBabysitter(this.state.sittingRequestsID, sitterId);
  };

  componentDidMount() {
    Api.get("sittingRequests/" + this.state.sittingRequestsID.toString()).then(
      resp => {
        this.setState({
          date: resp.sittingDate,
          startTime: resp.startTime,
          endTime: resp.endTime,
          address: resp.sittingAddress,
          bsitter: resp.bsitter,
          status: resp.status
        });
      }
    );
  }

  componentWillMount() {
    this.getAcceptedInvitations();
  }

  onButtonClick(targetStatus) {
    const data = {
      id: this.state.sittingRequestsID,
      status: targetStatus
    };
    
    cancelRequest(data).then(res => console.log(res)).catch(error => console.log(error));

  }

  render() {
    return (
      <ScrollView>
        <View style={{ marginHorizontal: 30, backgroundColor: "white" }}>
          <View style={styles.detailInformationContainer}>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-calendar"
                size={22}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformationDate}>
                {moment(this.state.date).format("dddd Do MMMM")}
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-cash"
                size={22}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformation}>
                {this.state.price}
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-timer"
                size={22}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformation}>
                {moment.utc(this.state.startTime, "HH:mm").format("HH:mm")} -
                {moment.utc(this.state.endTime, "HH:mm").format("HH:mm")}
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-home"
                size={22}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformation}>
                {this.state.address}
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-home"
                size={22}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformation}>
                {this.state.status}
              </MuliText>
            </View>
          </View>
          <View style={styles.detailContainer}>
            <MuliText style={styles.headerTitle}>CHILDREN</MuliText>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-happy"
                size={22}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformation}>
                Number of children: {this.state.childrenNumber}
              </MuliText>
            </View>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-heart-empty"
                size={22}
                style={{ marginBottom: -5 }}
                color="#bdc3c7"
              />
              <MuliText style={styles.contentInformation}>
                Min age:{this.state.minAgeOfChildren}
              </MuliText>
            </View>
          </View>
          <View style={styles.detailContainer}>
            <MuliText style={styles.headerTitle}>OPTIONS</MuliText>
            <View style={styles.informationText}>
              <Ionicons
                name="ios-cash"
                size={27}
                style={{ marginBottom: -5, marginHorizontal: 5 }}
                color="#bdc3c7"
              />
              <View style={styles.textOption}>
                <MuliText style={styles.optionInformation}>
                  Payment by Credit card
                </MuliText>
                <MuliText style={styles.grayOptionInformation}>
                  Card payment depends on sitter
                </MuliText>
              </View>
            </View>

            <View style={styles.informationText}>
              <Ionicons
                name="ios-car"
                size={27}
                style={{ marginBottom: -5, marginHorizontal: 5 }}
                color="#bdc3c7"
              />
              <View style={styles.textOption}>
                <MuliText style={styles.optionInformation}>
                  The Sitter does not have a car
                </MuliText>
                <MuliText style={styles.grayOptionInformation}>
                  I will take the Sitter home
                </MuliText>
              </View>
            </View>

            <View style={styles.informationText}>
              <Ionicons
                name="ios-text"
                size={27}
                style={{ marginBottom: -5, marginHorizontal: 5 }}
                color="#bdc3c7"
              />
              <View style={styles.textOption}>
                <MuliText style={styles.optionInformation}>VietNamese</MuliText>
                <MuliText style={styles.grayOptionInformation}>
                  I want the Sitter to speak one of these languages natively
                </MuliText>
              </View>
            </View>

            <View style={styles.informationText}>
              <Ionicons
                name="ios-man"
                size={27}
                style={{ marginBottom: -5, marginHorizontal: 10 }}
                color="#bdc3c7"
              />
              <View style={styles.textOption}>
                <MuliText style={styles.optionInformation}>
                  Complementary insurance
                </MuliText>
                <MuliText style={styles.grayOptionInformation}>
                  You didn't take the complementary insurance
                </MuliText>
              </View>
            </View>
          </View>

          {/* render babysitter if exist */}
          {this.state.bsitter ? (
            <View style={styles.detailContainer}>
              <MuliText style={styles.headerTitle}>SITTER</MuliText>
              <View style={styles.detailPictureContainer}>
                <View>
                  <Image
                    source={this.state.detailPictureSitter}
                    style={styles.profileImg}
                  ></Image>
                  <View style={styles.name}>
                    <MuliText>{this.state.nameSitter}</MuliText>
                  </View>
                </View>
              </View>
            </View>
          ) : (
              <View style={styles.detailContainer}></View>
            )}
          {/* end */}

          {/*  Confirm a sitter */}
          {this.state.bsitter == null && this.state.invitations.length > 0 && (
            <View style={styles.sectionContainer}>
              <View style={styles.headerSection}>
                <MuliText
                  style={{ fontSize: 18, color: "#315f61", marginLeft: 10 }}
                >
                  Confirm a sitter
                </MuliText>
              </View>
              <ScrollView>
                {this.state.invitations &&
                  this.state.invitations != [] &&
                  this.state.invitations.map((item, index) => (
                    <View key={item.id} style={styles.bsitterContainer}>
                      <View style={styles.bsitterItem}>
                        <TouchableOpacity>
                          <Image
                            source={images.parent}
                            style={styles.sitterImage}
                          />
                          <View>
                            <View style={styles.lowerText}>
                              <Ionicons
                                name="ios-pin"
                                size={24}
                                style={{ marginBottom: -4, marginLeft: 20 }}
                                color={colors.lightGreen}
                              />
                              <MuliText> 1.1 km </MuliText>
                              <Ionicons
                                name="ios-star"
                                size={24}
                                style={{ marginBottom: -4, marginLeft: 20 }}
                                color={colors.lightGreen}
                              />
                              <MuliText>
                                {item.user.babysitter.averageRating}
                              </MuliText>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <View>
                          {/* <TouchableOpacity style={styles.inviteButton} >
                          <MuliText style={{ color: "#78ddb6", fontSize: 16 }}>
                            Decline
                          </MuliText>
                        </TouchableOpacity> */}
                          <TouchableOpacity
                            style={styles.inviteButton}
                            onPress={() => this.acceptBabysitter(item.user.id)}
                          >
                            <MuliText
                              style={{ color: "#78ddb6", fontSize: 16 }}
                            >
                              Accept
                            </MuliText>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
              </ScrollView>
            </View>
          )}
          {/*  End Confirm a sitter */}

          {/* render button according status */}

          <View style={styles.buttonContainer}>
            {this.state.status == "PENDING" && (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={this.onButtonClick.bind(this, "CANCELED")}
              >
                <MuliText style={{ color: "white", fontSize: 16 }}>
                  Cancel
                </MuliText>
              </TouchableOpacity>
            )}

            {this.state.status == "CONFIRMED" && (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={this.onButtonClick.bind(this, "ONGOING")}
              >
                <MuliText style={{ color: "white", fontSize: 16 }}>
                  Babysitter Check-in
                </MuliText>
              </TouchableOpacity>
            )}

            {this.state.status == "ONGOING" && (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={this.onButtonClick.bind(this, "DONE")}
              >
                <MuliText style={{ color: "white", fontSize: 16 }}>
                  Confirm job is finished
                </MuliText>
              </TouchableOpacity>
            )}
          </View>
          {this.state.status == "ACCEPTED" || this.state.status == "DENIED" ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.answerButton}>
                <MuliText style={{ color: "white", fontSize: 16 }}>
                  Accept
                </MuliText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.answerButton}>
                <MuliText style={{ color: "white", fontSize: 16 }}>
                  Decline
                </MuliText>
              </TouchableOpacity>
            </View>
          ) : (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => {
                    this.props.navigation.navigate("Recommend", { userId: 1 });
                  }}
                >
                  <MuliText style={{ color: "white", fontSize: 16 }}>
                    Create Request
                </MuliText>
                </TouchableOpacity>
              </View>
            )}

          {/* end */}
        </View>
      </ScrollView>
    );
  }
}
RequestDetail.navigationOptions = {
  title: "Request Detail"
};

const styles = StyleSheet.create({
  lowerText: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center"
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
  inviteButton: {
    width: 100,
    height: 30,
    backgroundColor: "#315F61",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginLeft: 50
  },
  bsitterName: {
    fontSize: 18,
    fontWeight: "400",
    color: "#315F61"
  },
  upperText: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginLeft: 15,
    flex: 1,
    alignItems: "center"
  },
  sitterImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    resizeMode: "contain",
    marginLeft: 50
  },
  bsitterItem: {
    flexDirection: "row"
  },
  detailPictureContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 50,
    marginTop: 20,
    marginHorizontal: 35,
    justifyContent: "space-between"
  },
  detailContainer: {
    marginTop: 30
  },
  name: {
    alignItems: "center"
  },
  submitButton: {
    width: 250,
    height: 50,
    padding: 10,
    backgroundColor: "#315F61",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  answerButton: {
    width: 150,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -15,
    marginHorizontal: 10,
    backgroundColor: "#315F61",
    borderRadius: 10
  },
  headerTitle: {
    fontSize: 20,
    color: "#315F61",
    marginBottom: 10,
    fontWeight: "800"
  },
  optionsText: {
    fontSize: 20,
    color: "gray",
    fontWeight: "bold"
  },
  profileImg: {
    marginTop: 20,
    width: 70,
    height: 70,
    borderRadius: 100 / 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "black"
  },
  textAndDayContainer: {
    flexDirection: "row"
  },
  informationText: {
    fontSize: 18,
    marginTop: 30,
    flexDirection: "row",
    color: "#bdc3c7"
    // backgroundColor: 'red',
  },
  contentInformation: {
    fontSize: 15,
    paddingLeft: 15,
    color: "#315F61"
  },
  contentInformationDate: {
    fontSize: 15,
    paddingLeft: 15,
    color: "#315F61",
    fontWeight: "700"
  },
  priceText: {
    fontSize: 20,
    marginLeft: 150,
    marginTop: 30,
    flexDirection: "row"
  },
  detailInformationContainer: {
    flex: 1,
    marginTop: 20,
    marginHorizontal: 10,
    marginLeft: 10
  },
  detailOptionsContainer: {
    flex: 1,
    marginTop: 20
  },
  optionText: {
    fontSize: 20,
    marginLeft: 50,
    marginTop: 30,
    flexDirection: "row"
  },

  optionInformation: {
    fontSize: 18,
    paddingLeft: 20,
    fontWeight: "400"
  },
  grayOptionInformation: {
    color: "#bdc3c7",
    fontSize: 16,
    paddingLeft: 20,
    fontWeight: "200"
  },
  textOption: {
    marginHorizontal: 5
  }
});
