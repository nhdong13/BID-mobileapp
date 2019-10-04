import * as WebBrowser from 'expo-web-browser';
import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Button,
  View,
} from 'react-native';

import { MuliText } from '../components/StyledText';
import { Agenda } from 'react-native-calendars';
import RequestItem from '../components/RequestItem';
import { TouchableOpacity } from 'react-native-gesture-handler';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: '',
      requests: {

      },
    }
  }

  render() {
    const { show, date, mode } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.scheduleContainer}>
          <MuliText style={{ fontSize: 20, color: '#707070' }}>When would you need a babysitter ?</MuliText>
        </View>
        <Agenda
          items={{
            '2019-10-04': [
              {
                date: '2019-10-03',
                price: '30',
                startTime: '12:00 AM',
                endTime: '3:00 AM',
                address: '68/87 TA20, Thoi An, Ho Chi Minh, Viet Nam',
                status: 'pending'
              },
              {
                date: '2019-10-03',
                price: '89',
                startTime: '6:00 AM',
                endTime: '9:00 AM',
                address: '68/87 TA20, Thoi An, Ho Chi Minh, Viet Nam',
                status: 'pending'
              },
            ],
          }}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={50}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={50}
          // specify how each item should be rendered in agenda
          renderItem={(item) => {
            return (
              <TouchableOpacity>
                <View style={styles.requestItem}>
                  <View style={styles.leftInformation}>
                    <MuliText>{item.date}</MuliText>
                    <MuliText>{item.startTime}</MuliText>
                    <MuliText>{item.endTime}</MuliText>
                  </View>
                  <View style={styles.rightInformation}>
                    <MuliText>{item.price}</MuliText>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
          rowHasChanged={(r1, r2) => { return r1.text !== r2.text }}
          // specify how each date should be rendered. day can be undefined if the item is not first in that day.
          renderDay={(day, item) => { return (<View />); }}
          // specify how empty date content with no items should be rendered
          renderEmptyDate={() => { return (<View />); }}
          // specify what should be rendered instead of ActivityIndicator
          renderEmptyData={() => { return (<MuliText>cha co gi de show ca</MuliText>); }}
          // Hide knob button. Default = false
          hideKnob={false}
          theme={{
          }}
          style={{}}
        />
      </View>
    );
  }
}

export default HomeScreen;

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    width: 360,
    height: 250,
  },
  requestItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'yellow',
    height: 120,
    marginHorizontal: 30,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 15,
  },
  leftInformation: {
    backgroundColor: 'blue',
    margin: 15,
    paddingHorizontal: 5,
    flex: 1,
  },
  rightInformation: {
    backgroundColor: 'green',
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  scheduleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    paddingTop: 20,
    marginBottom: 20,
    flex: 0.2,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'muli',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
