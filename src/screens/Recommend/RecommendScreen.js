import React, { Component } from "react";
import { Image, StyleSheet, View } from "react-native";

import { MuliText } from "components/StyledText";
import { Ionicons } from "@expo/vector-icons";
import { recommend } from "api/sittingRequest.api";
import { FlatList } from "react-native-gesture-handler";
import Bsitter from 'screens/Recommend/BsitterItem';

export default class RecommendScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matchedCount: 0,
      listMatched: [],
      recommendCount: 0,
      recommendList: [],
      requestId: 0
    };
  }

  getRecommendation = async () => {
    if (this.state.requestId !== 0) {
      let data = await recommend(this.state.requestId);
      this.setState({
        matchedCount: data.matchedCount,
        listMatched: data.listMatched,
        recommendCount: data.recommendCount,
        recommendList: data.recommendList
      });

      return data;
    } else {
      console.log("RequestId not found - getRecommedation");
    }
  };

  changeInviteStatus = (receiverId) => {
    this.setState(prevState => ({
      listMatched: prevState.listMatched.map(el =>
        el.userId === receiverId
          ? Object.assign(el, { isInvited: true })
          : el
      ),
      recommendList: prevState.recommendList.map(el =>
        el.userId === receiverId
          ? Object.assign(el, { isInvited: true })
          : el
      )
    }));
    console.log(this.state.listMatched);
  }

  componentWillMount() {
    const requestId = this.props.navigation.getParam("requestId");
    if (requestId && requestId !== 0) {
      this.setState({ requestId: requestId }, () => this.getRecommendation());
    } else {
      console.log("requestId not found - RecommendScreen");
    }
  }

  // netstat -ano | findstr 3000
  render() {
    return (
      <View style={styles.container}>
        {this.state.recommendList && this.state.recommendList.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.headerSection}>
            <Ionicons
              name="ios-arrow-down"
              size={24}
              style={{ marginBottom: -6, marginLeft: 20 }}
              color="#315f61"
            />
            <MuliText
              style={{ fontSize: 18, color: "#315f61", marginLeft: 10 }}
            >
              Recommend ({this.state.recommendCount})
            </MuliText>
          </View>

          {
            this.state.recommendList &&
            this.state.recommendList.length != 0 && (
              <FlatList 
                data={this.state.recommendList}
                renderItem={({ item }) => <Bsitter callBack={this.changeInviteStatus} requestId={this.state.requestId} item={item} />}
                keyExtractor={item => item.user.id.toString()}
              />
            )
          }
        </View>
        )}

        <View style={styles.sectionContainer}>
          <View style={styles.headerSection}>
            <Ionicons
              name="ios-arrow-down"
              size={24}
              style={{ marginBottom: -6, marginLeft: 20 }}
              color="#315f61"
            />
            <MuliText
              style={{ fontSize: 18, color: "#315f61", marginLeft: 10 }}
            >
              Matched Babysitter ({this.state.matchedCount})
            </MuliText>
          </View>
          {
            this.state.listMatched &&
            this.state.listMatched.length != 0 && (
              <FlatList 
                data={this.state.listMatched}
                renderItem={({ item }) => <Bsitter callBack={this.changeInviteStatus} requestId={this.state.requestId} item={item} />}
                keyExtractor={item => item.user.id.toString()}
              />
            )
          }

        </View>
      </View>
    );
  }
}

RecommendScreen.navigationOptions = {
  title: "Recommend babysitter"
};

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
    // flex: 1,
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
    marginTop: 20
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
