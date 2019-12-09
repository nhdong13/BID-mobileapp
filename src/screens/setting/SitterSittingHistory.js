import React, { Component } from 'react';
import { retrieveToken } from 'utils/handleToken';
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  RefreshControl,
  Dimensions,
} from 'react-native';

import { MuliText } from 'components/StyledText';
import Api from 'api/api_helper';
import colors from 'assets/Color';
import ItemSitterHistory from 'screens/setting/ItemSitterHistory';
import Loader from 'utils/Loader';
import moment from 'moment';

const { height } = Dimensions.get('window');

export class SitterSittingHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      loading: false,
      refreshing: false,
    };
  }

  async componentWillMount() {
    await retrieveToken().then((res) => {
      const { userId } = res;
      this.setState({ userId });
    });
    await this.getInvitationData();
  }

  getInvitationData = async () => {
    // get data for the babysitter (invitations)
    const { userId } = this.state;
    const requestBody = {
      id: userId,
    };
    this.setState({ loading: true });
    console.log(requestBody);

    await Api.post('invitations/sitterInvitation', requestBody)
      .then((invitations) => {
        // console.log(
        //   'PHUC: SitterSittingHistory -> getInvitationData -> invitations',
        //   invitations,
        // );
        invitations.sort((a, b) => this.compareInviteByDate(a, b));

        const sittingHistory = invitations.filter(
          (invitation) =>
            invitation.sittingRequest.status !== 'PENDING' &&
            invitation.sittingRequest.status !== 'ONGOING' &&
            invitation.sittingRequest.status !== 'CONFIRMED',
        );
        // console.log(
        //   'PHUC: SitterSittingHistory -> getInvitationData -> sittingHistory',
        //   sittingHistory,
        // );
        this.setState({
          sittingHistory,
          loading: false,
        });
      })
      .catch((error) => {
        console.log(
          'PHUC: SitterSittingHistory -> getInvitationData -> error',
          error,
        );
        this.setState({ loading: false });
      });
  };

  compareInviteByDate = (a, b) => {
    const aTime = moment(
      `${a.sittingRequest.sittingDate} ${a.sittingRequest.startTime}`,
      'DD-MM-YYYY HH:mm:ss',
    ).format('DD-MM-YYYY HH:mm:ss');
    const bTime = moment(
      `${b.sittingRequest.sittingDate} ${b.sittingRequest.startTime}`,
      'DD-MM-YYYY HH:mm:ss',
    ).format('DD-MM-YYYY HH:mm:ss');

    return aTime > bTime;
  };

  _onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.getSittingRequest().then(() => {
      this.setState({ refreshing: false });
    });
  };

  render() {
    const { sittingHistory, refreshing, loading } = this.state;
    const { noRequest, noRequestText, noRequestImage } = styles;
    return (
      <View
        style={{
          flex: 1,
          // backgroundColor: colors.gray,
        }}
      >
        <Loader loading={loading} />
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this._onRefresh}
            />
          }
          data={sittingHistory}
          renderItem={({ item }) => <ItemSitterHistory invitation={item} />}
          keyExtractor={(item) => item.id.toString()}
          style={{ backgroundColor: colors.homeColor }}
          ListEmptyComponent={
            <View style={noRequest}>
              <MuliText style={noRequestText}>
                Bạn chưa thực hiện yêu cầu trông trẻ nào cả
              </MuliText>
              <Image
                source={require('assets/images/no-pending.png')}
                style={noRequestImage}
              />
            </View>
          }
        />
      </View>
    );
  }
}

export default SitterSittingHistory;

SitterSittingHistory.navigationOptions = {
  title: 'Lịch sử giữ trẻ',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray,
  },

  statusBoxConfirm: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: 40,
    padding: 10,
  },
  noRequest: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    // marginTop: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
    height: height,
  },
  noRequestText: {
    marginVertical: 10,
    marginHorizontal: 30,
    paddingTop: 20,
    fontSize: 18,
    color: colors.darkGreenTitle,
    fontWeight: 'bold',
  },
  noRequestImage: {
    width: 261,
    height: 236,
    marginVertical: 20,
  },
  leftInformation: {
    margin: 15,
    paddingHorizontal: 5,
    flex: 1,
  },
  date: {
    marginBottom: 10,
    color: colors.darkGreenTitle,
    fontWeight: '400',
    fontSize: 15,
  },
});
