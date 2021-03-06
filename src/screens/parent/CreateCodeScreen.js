/* eslint-disable no-unused-vars */
/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { MuliText } from 'components/StyledText';
import { ScrollView } from 'react-native-gesture-handler';
import { createCode } from 'api/parent.api';
import Toast, { DURATION } from 'react-native-easy-toast';

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
        <View style={{ marginTop: 40 }}>
          <Toast ref="toast" />
          <View
            style={{
              width: 350,
              borderColor: 'gray',
              borderWidth: 1,
              marginHorizontal: 10,
            }}
          >
            <TextInput
              style={{
                marginLeft: 10,
              }}
              value={this.state.code}
              onChangeText={(code) => this.setState({ code })}
              placeholder="Nhập mã"
              editable={this.state.disableCreate}
            />
          </View>
          {/* {this.state.disableCreate && ( */}
          <TouchableOpacity style={{ alignItems: 'center', marginTop: 10 }}>
            <MuliText onPress={() => this.createNewCode()}>Tạo mã</MuliText>
          </TouchableOpacity>
          {/* )} */}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({});
