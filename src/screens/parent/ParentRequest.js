import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { MuliText } from 'components/StyledText';
import moment from 'moment';
import colors from 'assets/Color';
import { formater } from 'utils/MoneyFormater';

class ParentRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { request } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('RequestDetail', {
              requestId: request.id,
            })
          }
        >
          <View style={styles.requestItem}>
            <View style={styles.leftInformation}>
              <MuliText style={styles.date}>
                {moment(request.sittingDate).format('dddd Do MMMM')}
              </MuliText>
              <MuliText style={{ color: '#7edeb9' }}>
                {moment.utc(request.startTime, 'HH:mm').format('HH:mm')} -
                {moment.utc(request.endTime, 'HH:mm').format('HH:mm')}
              </MuliText>
            </View>
            <View style={styles.rightInformation}>
              {request.status == 'PENDING' && (
                <View style={styles.statusBoxPending}>
                  <MuliText
                    style={{ fontWeight: '100', color: colors.pending }}
                  >
                    {request.status}
                  </MuliText>
                </View>
              )}
              {request.status == 'DONE' && (
                <View style={styles.statusBoxPending}>
                  <MuliText style={{ fontWeight: '100', color: colors.done }}>
                    {request.status}
                  </MuliText>
                </View>
              )}
              {request.status == 'ONGOING' && (
                <View style={styles.statusBoxPending}>
                  <MuliText
                    style={{ fontWeight: '100', color: colors.ongoing }}
                  >
                    {request.status}
                  </MuliText>
                </View>
              )}
              {request.status == 'CANCELED' && (
                <View style={styles.statusBoxPending}>
                  <MuliText
                    style={{ fontWeight: '100', color: colors.canceled }}
                  >
                    {request.status}
                  </MuliText>
                </View>
              )}
              {request.status == 'CONFIRMED' && (
                <View style={styles.statusBoxPending}>
                  <MuliText
                    style={{ fontWeight: '100', color: colors.confirmed }}
                  >
                    {request.status}
                  </MuliText>
                </View>
              )}
              <MuliText>{formater(request.totalPrice)} VND</MuliText>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default withNavigation(ParentRequest);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  createRequest: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    opacity: 0.9,
    bottom: 10,
    right: 10,
  },
  textHeaderParent: {
    fontSize: 20,
    color: '#315f61',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  textHeaderBsitter: {
    fontSize: 20,
    color: '#315f61',
    fontWeight: 'bold',
    lineHeight: 20,
    alignItems: 'flex-start',
  },
  statusBoxPending: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
    width: 120,
    height: 40,
    padding: 10,
  },
  statusBoxConfirm: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
    width: 100,
    height: 50,
    padding: 5,
  },
  noRequest: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  noRequestText: {
    marginVertical: 10,
    marginHorizontal: 30,
    paddingTop: 20,
    fontSize: 18,
    color: '#315f61',
    fontWeight: 'bold',
  },
  noRequestImage: {
    width: 261,
    height: 236,
    marginVertical: 20,
  },
  requestItemSitter: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 200,
    width: 350,
    marginHorizontal: 15,
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 5,
  },
  requestItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 130,
    marginHorizontal: 30,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 15,
    marginBottom: 5,
  },
  leftInformationSitter: {
    // backgroundColor: 'blue',
    marginLeft: 10,
    flex: 1,
  },
  fuckthisshit: {},
  leftInformation: {
    // backgroundColor: 'blue',
    margin: 10,
    paddingHorizontal: 5,
    flex: 1,
  },
  rightInformation: {
    // backgroundColor: 'green',
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  scheduleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    paddingVertical: 15,
    marginBottom: 20,
    flex: 0.1,
    backgroundColor: '#fff',
  },
  scheduleContainerBsitter: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 25,
    paddingVertical: 15,
    paddingLeft: 30,
    flex: 0.25,
    backgroundColor: '#fff',
  },
  date: {
    marginTop: 5,
    marginBottom: 10,
    color: colors.darkGreenTitle,
    fontWeight: '400',
    fontSize: 15,
  },
});
