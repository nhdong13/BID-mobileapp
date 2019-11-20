/* eslint-disable no-unused-vars */
/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { MuliText } from 'components/StyledText';
import { ScrollView } from 'react-native-gesture-handler';
import { createCode } from 'api/parent.api';
import Toast, { DURATION } from 'react-native-easy-toast';
import colors from 'assets/Color';

export default class CreateCodeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      code: null,
      disableCreate: true,
    };
  }

  componentWillMount() {
    const userId = this.props.navigation.getParam('userId');
    this.setState({ userId });
  }

  createNewCode() {
    createCode(this.state.userId, this.state.code)
      .then((result) => {
        console.log('a');
        this.setState({ disableCreate: false });
        this.refs.toast.show('Tạo thành công', DURATION.LENGTH_LONG);
      })
      .catch((error) => {
        console.log('b');
        this.refs.toast.show('Mã trùng', DURATION.LENGTH_LONG);
      });
  }

  render() {
    return (
      <ScrollView>
        <View style={{ marginTop: 15, alignItems: 'center' }}>
          <MuliText style={styles.headerTitle}>Tạo mã</MuliText>
          <MuliText style={styles.grayOptionInformation}>
            Tạo mã cá nhân của tôi
          </MuliText>
        </View>
        <View style={{ marginTop: 20 }}>
          <Toast ref="toast" />
          <View
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              marginHorizontal: 10,
              borderRadius: 7,
              height: 30,
            }}
          >
            <TextInput
              style={{
                marginLeft: 10,
                marginTop: 10,
              }}
              value={this.state.code}
              onChangeText={(code) => this.setState({ code })}
              placeholder="Nhập mã"
              editable={this.state.disableCreate}
            />
          </View>
          {this.state.disableCreate && (
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  marginTop: 15,
                  borderColor: colors.done,
                  borderWidth: 1,
                  width: 90,
                  borderRadius: 7,
                }}
                onPress={() => this.createNewCode()}
              >
                <MuliText style={{ color: colors.done }}>Tạo mã</MuliText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  grayOptionInformation: {
    color: '#bdc3c7',
    fontSize: 11,
    fontWeight: '200',
  },
  headerTitle: {
    fontSize: 15,
    color: '#315F61',
    marginBottom: 10,
    fontWeight: '800',
  },
});
