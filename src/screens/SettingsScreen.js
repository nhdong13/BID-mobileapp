import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons/';
import { MuliText } from 'components/StyledText';
import logout from 'api/logout';

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onLogout = async () => {
    logout()
      .then((res) => {
        console.log(res);
        if (res) {
          this.props.navigation.navigate('Auth');
        }
      })
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <ScrollView>
        {/* <View style={styles.informationContainer}></View> */}
        <View style={{ marginHorizontal: 25, marginTop: 10 }}>
          <MuliText style={styles.headerTitle}>MY ACCOUNT</MuliText>
          <View>
            <TouchableOpacity style={styles.detailInformationContainer}>
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-switch"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>
                  Sitting preferences
                </MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailInformationContainer}>
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-home"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>
                  Address and Schedule
                </MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailInformationContainer}>
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-calendar"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>
                  Unavailabilities
                </MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailInformationContainer}>
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-timer"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>History</MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailInformationContainer}>
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-contacts"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>My family</MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailInformationContainer}>
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-cash"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>Payment</MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginHorizontal: 25, marginTop: 20 }}>
          <MuliText style={styles.headerTitle}>SETTINGS</MuliText>
          <View>
            <TouchableOpacity style={styles.detailInformationContainer}>
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-settings"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>Settings</MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailInformationContainer}>
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-information-circle-outline"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
                <MuliText style={styles.contentInformation}>
                  Help & Info
                </MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.detailInformationContainer}
              onPress={this.onLogout}
            >
              <View style={styles.informationText}>
                <Ionicons
                  name="ios-log-out"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="red"
                />
                <MuliText style={styles.contentInformation}>Log out</MuliText>
              </View>
              <View>
                <Ionicons
                  name="ios-arrow-forward"
                  size={22}
                  style={{ marginBottom: -5 }}
                  color="#bdc3c7"
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

SettingsScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  contentInformation: {
    fontSize: 15,
    paddingLeft: 15,
    color: '#315F61',
  },
  detailInformationContainer: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'red'
  },
  informationText: {
    fontSize: 18,
    flexDirection: 'row',
    color: '#bdc3c7',
    // backgroundColor: 'red',
  },
  headerTitle: {
    fontSize: 25,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800',
  },
  nameText: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  viewProfileText: {
    fontSize: 15,
  },
  informationContainer: {
    marginHorizontal: 25,
    flexDirection: 'row',
    marginTop: 35,
    // backgroundColor: 'red',
  },
  profileImg: {
    marginLeft: 'auto',
    width: 80,
    height: 80,
    borderRadius: 160 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'black',
  },
});
