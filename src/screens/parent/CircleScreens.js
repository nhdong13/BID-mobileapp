import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { MuliText } from 'components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import colors from 'assets/Color';
import { CheckBox } from 'native-base';
export default class CircleScreens extends Component {
  constructor(props) {
    super(props);
    this.state = {
      circle: true,
      chooseBabySitter: true,
      friend: true,
      nearBabySitter: true,
    };
  }
  circle() {
    if (this.state.circle) {
      this.setState({ circle: false });
    } else {
      this.setState({ circle: true });
    }
  }

  chooseBabySitter() {
    if (this.state.chooseBabySitter) {
      this.setState({ chooseBabySitter: false });
    } else {
      this.setState({ chooseBabySitter: true });
    }
  }
  friend() {
    if (this.state.friend) {
      this.setState({ friend: false });
    } else {
      this.setState({ friend: true });
    }
  }
  nearBabySitter() {
    if (this.state.nearBabySitter) {
      this.setState({ nearBabySitter: false });
    } else {
      this.setState({ nearBabySitter: true });
    }
  }
  render() {
    return (
      <ScrollView style={{ backgroundColor: '#dfe6e9' }}>
        {/* Header vòng tròn tin tưởng của tôi */}
        <View style={styles.firstHeaderContainer}>
          <TouchableOpacity
            onPress={() => {
              this.circle();
            }}
            style={{ flexDirection: 'row' }}
          >
            <Ionicons
              name="ios-man"
              size={24}
              style={{ marginBottom: -4, marginLeft: 20, marginTop: 5 }}
              color={colors.darkGreenTitle}
            />
            <MuliText style={styles.headerText}>
              Vòng tròn tin tưởng của tôi (2)
            </MuliText>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 'auto' }}>
            <MuliText style={styles.textDeselect}>Bỏ chọn tất cả</MuliText>
          </TouchableOpacity>
        </View>
        {/* End header */}

        {/* Item vòng tròn tin tưởng của tôi */}
        {this.state.circle && (
          <View style={styles.itemContainer}>
            {/* Item chi tiết */}
            <View style={styles.bsitterItem}>
              <TouchableOpacity style={{ flexDirection: 'row', flexGrow: 2 }}>
                <Image
                  source={require('assets/images/Phuc.png')}
                  style={styles.sitterImage}
                />
                <View>
                  <View style={styles.upperText}>
                    <MuliText style={styles.bsitterName}>Ky - 23</MuliText>
                    <Ionicons
                      name="ios-male"
                      size={20}
                      style={{ marginBottom: -2, marginLeft: 10 }}
                      color={colors.blueAqua}
                    />
                  </View>
                  <View style={styles.lowerText}>
                    <Ionicons
                      name="ios-pin"
                      size={24}
                      style={{ marginBottom: -4 }}
                      color={colors.lightGreen}
                    />
                    <MuliText style={{ marginLeft: 5 }}>5 km </MuliText>
                    <Ionicons
                      name="ios-star"
                      size={24}
                      style={{ marginBottom: -4, marginLeft: 10 }}
                      color={colors.lightGreen}
                    />
                    <MuliText style={{ marginLeft: 5 }}>4 </MuliText>
                  </View>
                </View>
              </TouchableOpacity>
              <View />
              <TouchableOpacity style={styles.inviteButton}>
                <CheckBox
                  style={{
                    marginTop: 5,
                    width: 18,
                    height: 18,
                    borderRadius: 20 / 2,
                    borderColor: 'black',
                    backgroundColor: 'black',
                  }}
                  checked={true}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.bsitterItem}>
              <TouchableOpacity style={{ flexDirection: 'row', flexGrow: 2 }}>
                <Image
                  source={require('assets/images/Phuc.png')}
                  style={styles.sitterImage}
                />
                <View>
                  <View style={styles.upperText}>
                    <MuliText style={styles.bsitterName}>Ky - 23</MuliText>
                    <Ionicons
                      name="ios-male"
                      size={20}
                      style={{ marginBottom: -2, marginLeft: 10 }}
                      color={colors.blueAqua}
                    />
                  </View>
                  <View style={styles.lowerText}>
                    <Ionicons
                      name="ios-pin"
                      size={24}
                      style={{ marginBottom: -4 }}
                      color={colors.lightGreen}
                    />
                    <MuliText style={{ marginLeft: 5 }}>5 km </MuliText>
                    <Ionicons
                      name="ios-star"
                      size={24}
                      style={{ marginBottom: -4, marginLeft: 10 }}
                      color={colors.lightGreen}
                    />
                    <MuliText style={{ marginLeft: 5 }}>4 </MuliText>
                  </View>
                </View>
              </TouchableOpacity>
              <View />
              <TouchableOpacity style={styles.inviteButton}>
                <CheckBox
                  style={{
                    marginTop: 5,
                    width: 18,
                    height: 18,
                    borderRadius: 20 / 2,
                    borderColor: 'black',
                    backgroundColor: 'black',
                  }}
                  checked={true}
                />
              </TouchableOpacity>
            </View>
            {/* End Item chi tiết */}
          </View>
        )}
        {/* End item */}

        {/* Header người giữ trẻ bạn đã chọn*/}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              this.chooseBabySitter();
            }}
            style={{ flexDirection: 'row' }}
          >
            <Ionicons
              name="ios-man"
              size={24}
              style={{ marginBottom: -4, marginLeft: 20, marginTop: 5 }}
              color={colors.darkGreenTitle}
            />
            <MuliText style={styles.headerText}>
              Người giữ trẻ bạn đã chọn (2)
            </MuliText>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 'auto' }}>
            <MuliText style={styles.textDeselect}>Bỏ chọn tất cả</MuliText>
          </TouchableOpacity>
        </View>
        {/* End header*/}

        {/* Item của người giữ trẻ bạn đã chọn */}
        {this.state.chooseBabySitter && (
          <View style={styles.itemContainer}>
            <View
              style={{
                alignItems: 'center',
                alignContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              {/* Item chi tiết */}
              <View style={{ alignItems: 'center', marginLeft: 10 }}>
                <Image
                  source={require('assets/images/Phuc.png')}
                  style={{
                    opacity: null,
                    width: 60,
                    height: 60,
                    borderRadius: 120 / 2,
                    overflow: 'hidden',
                  }}
                />
                <View>
                  <View
                    style={{
                      alignItems: 'center',
                    }}
                  >
                    <MuliText
                      style={{
                        color: 'black',
                      }}
                    >
                      Ky
                    </MuliText>
                  </View>
                  <CheckBox
                    style={{
                      marginTop: 5,
                      width: 18,
                      height: 18,
                      borderRadius: 20 / 2,
                      borderColor: 'black',
                      backgroundColor: 'black',
                    }}
                    checked={true}
                  />
                </View>
              </View>
              <View style={{ alignItems: 'center', marginLeft: 10 }}>
                <Image
                  source={require('assets/images/Phuc.png')}
                  style={{
                    opacity: null,
                    width: 60,
                    height: 60,
                    borderRadius: 120 / 2,
                    overflow: 'hidden',
                  }}
                />
                <View>
                  <View
                    style={{
                      alignItems: 'center',
                    }}
                  >
                    <MuliText
                      style={{
                        color: 'black',
                      }}
                    >
                      Ky
                    </MuliText>
                  </View>
                  <CheckBox
                    style={{
                      marginTop: 5,
                      width: 18,
                      height: 18,
                      borderRadius: 20 / 2,
                      borderColor: 'black',
                      backgroundColor: 'black',
                    }}
                    checked={true}
                  />
                </View>
              </View>
              <View style={{ alignItems: 'center', marginLeft: 10 }}>
                <Image
                  source={require('assets/images/Phuc.png')}
                  style={{
                    opacity: null,
                    width: 60,
                    height: 60,
                    borderRadius: 120 / 2,
                    overflow: 'hidden',
                  }}
                />
                <View>
                  <View
                    style={{
                      alignItems: 'center',
                    }}
                  >
                    <MuliText
                      style={{
                        color: 'black',
                      }}
                    >
                      Ky
                    </MuliText>
                  </View>
                  <CheckBox
                    style={{
                      marginTop: 5,
                      width: 18,
                      height: 18,
                      borderRadius: 20 / 2,
                      borderColor: 'black',
                      backgroundColor: 'black',
                    }}
                    checked={true}
                  />
                </View>
              </View>
              {/* End Item chi tiết */}
            </View>
          </View>
        )}
        {/* End item */}

        {/* Header bạn bè */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              this.friend();
            }}
            style={{ flexDirection: 'row' }}
          >
            <Ionicons
              name="ios-man"
              size={24}
              style={{ marginBottom: -4, marginLeft: 20, marginTop: 5 }}
              color={colors.darkGreenTitle}
            />
            <MuliText style={styles.headerText}>Bạn bè (2)</MuliText>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 'auto' }}>
            <MuliText style={styles.textDeselect}>Bỏ chọn tất cả</MuliText>
          </TouchableOpacity>
        </View>
        {/* End header */}

        {/* Item bạn bè */}
        {this.state.friend && (
          <View style={styles.itemContainer}>
            {/* Item chi tiết */}
            <View style={styles.bsitterItem}>
              <TouchableOpacity style={{ flexDirection: 'row', flexGrow: 2 }}>
                <Image
                  source={require('assets/images/Phuc.png')}
                  style={styles.sitterImage}
                />
                <View>
                  <View style={styles.upperText}>
                    <MuliText style={styles.bsitterName}>Ky - 23</MuliText>
                    <Ionicons
                      name="ios-male"
                      size={20}
                      style={{ marginBottom: -2, marginLeft: 10 }}
                      color={colors.blueAqua}
                    />
                  </View>
                  <View style={styles.lowerText}>
                    <Ionicons
                      name="ios-pin"
                      size={24}
                      style={{ marginBottom: -4 }}
                      color={colors.lightGreen}
                    />
                    <MuliText style={{ marginLeft: 5 }}>5 km </MuliText>
                    <Ionicons
                      name="ios-star"
                      size={24}
                      style={{ marginBottom: -4, marginLeft: 10 }}
                      color={colors.lightGreen}
                    />
                    <MuliText style={{ marginLeft: 5 }}>4 </MuliText>
                  </View>
                </View>
              </TouchableOpacity>
              <View />
              <TouchableOpacity style={styles.inviteButton}>
                <CheckBox
                  style={{
                    marginTop: 5,
                    width: 18,
                    height: 18,
                    borderRadius: 20 / 2,
                    borderColor: 'black',
                    backgroundColor: 'black',
                  }}
                  checked={true}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.bsitterItem}>
              <TouchableOpacity style={{ flexDirection: 'row', flexGrow: 2 }}>
                <Image
                  source={require('assets/images/Phuc.png')}
                  style={styles.sitterImage}
                />
                <View>
                  <View style={styles.upperText}>
                    <MuliText style={styles.bsitterName}>Ky - 23</MuliText>
                    <Ionicons
                      name="ios-male"
                      size={20}
                      style={{ marginBottom: -2, marginLeft: 10 }}
                      color={colors.blueAqua}
                    />
                  </View>
                  <View style={styles.lowerText}>
                    <Ionicons
                      name="ios-pin"
                      size={24}
                      style={{ marginBottom: -4 }}
                      color={colors.lightGreen}
                    />
                    <MuliText style={{ marginLeft: 5 }}>5 km </MuliText>
                    <Ionicons
                      name="ios-star"
                      size={24}
                      style={{ marginBottom: -4, marginLeft: 10 }}
                      color={colors.lightGreen}
                    />
                    <MuliText style={{ marginLeft: 5 }}>4 </MuliText>
                  </View>
                </View>
              </TouchableOpacity>
              <View />
              <TouchableOpacity style={styles.inviteButton}>
                <CheckBox
                  style={{
                    marginTop: 5,
                    width: 18,
                    height: 18,
                    borderRadius: 20 / 2,
                    borderColor: 'black',
                    backgroundColor: 'black',
                  }}
                  checked={true}
                />
              </TouchableOpacity>
            </View>
            {/* End item chi tiết */}
          </View>
        )}
        {/* End item*/}

        {/* Header người giữ trẻ ở gần*/}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              this.nearBabySitter();
            }}
            style={{ flexDirection: 'row' }}
          >
            <Ionicons
              name="ios-man"
              size={24}
              style={{ marginBottom: -4, marginLeft: 20, marginTop: 5 }}
              color={colors.darkGreenTitle}
            />
            <MuliText style={styles.headerText}>
              Người giữ trẻ ở gần (2)
            </MuliText>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 'auto' }}>
            <MuliText style={styles.textDeselect}>Bỏ chọn tất cả</MuliText>
          </TouchableOpacity>
        </View>
        {/* End header */}

        {/* Item người giữ trẻ ở gần */}
        {this.state.nearBabySitter && (
          <View style={styles.itemContainer}>
            {/* Item chi tiết */}
            <View style={styles.bsitterItem}>
              <TouchableOpacity style={{ flexDirection: 'row', flexGrow: 2 }}>
                <Image
                  source={require('assets/images/Phuc.png')}
                  style={styles.sitterImage}
                />
                <View>
                  <View style={styles.upperText}>
                    <MuliText style={styles.bsitterName}>Ky - 23</MuliText>
                    <Ionicons
                      name="ios-male"
                      size={20}
                      style={{ marginBottom: -2, marginLeft: 10 }}
                      color={colors.blueAqua}
                    />
                  </View>
                  <View style={styles.lowerText}>
                    <Ionicons
                      name="ios-pin"
                      size={24}
                      style={{ marginBottom: -4 }}
                      color={colors.lightGreen}
                    />
                    <MuliText style={{ marginLeft: 5 }}>5 km </MuliText>
                    <Ionicons
                      name="ios-star"
                      size={24}
                      style={{ marginBottom: -4, marginLeft: 10 }}
                      color={colors.lightGreen}
                    />
                    <MuliText style={{ marginLeft: 5 }}>4 </MuliText>
                  </View>
                </View>
              </TouchableOpacity>
              <View />
              <TouchableOpacity style={styles.inviteButton}>
                <CheckBox
                  style={{
                    marginTop: 5,
                    width: 18,
                    height: 18,
                    borderRadius: 20 / 2,
                    borderColor: 'black',
                    backgroundColor: 'black',
                  }}
                  checked={true}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.bsitterItem}>
              <TouchableOpacity style={{ flexDirection: 'row', flexGrow: 2 }}>
                <Image
                  source={require('assets/images/Phuc.png')}
                  style={styles.sitterImage}
                />
                <View>
                  <View style={styles.upperText}>
                    <MuliText style={styles.bsitterName}>Ky - 23</MuliText>
                    <Ionicons
                      name="ios-male"
                      size={20}
                      style={{ marginBottom: -2, marginLeft: 10 }}
                      color={colors.blueAqua}
                    />
                  </View>
                  <View style={styles.lowerText}>
                    <Ionicons
                      name="ios-pin"
                      size={24}
                      style={{ marginBottom: -4 }}
                      color={colors.lightGreen}
                    />
                    <MuliText style={{ marginLeft: 5 }}>5 km </MuliText>
                    <Ionicons
                      name="ios-star"
                      size={24}
                      style={{ marginBottom: -4, marginLeft: 10 }}
                      color={colors.lightGreen}
                    />
                    <MuliText style={{ marginLeft: 5 }}>4 </MuliText>
                  </View>
                </View>
              </TouchableOpacity>
              <View />
              <TouchableOpacity style={styles.inviteButton}>
                <CheckBox
                  style={{
                    marginTop: 5,
                    width: 18,
                    height: 18,
                    borderRadius: 20 / 2,
                    borderColor: 'black',
                    backgroundColor: 'black',
                  }}
                  checked={true}
                />
              </TouchableOpacity>
            </View>
            {/* End item chi tiết */}
          </View>
        )}
        {/* End item */}
      </ScrollView>
    );
  }
}
CircleScreens.navigationOptions = {
  header: null,
};
const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 15,
    backgroundColor: '#fff',
  },
  firstHeaderContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 35,
    backgroundColor: '#fff',
    height: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 6,
    backgroundColor: '#fff',
    height: 30,
  },
  headerText: {
    marginTop: 5,
    fontSize: 15,
    color: colors.darkGreenTitle,
    marginLeft: 10,
  },
  textDeselect: {
    marginTop: 5,
    fontSize: 15,
    color: colors.lightGreen,
  },
  container: {
    flex: 1,
    backgroundColor: '#dfe6e9',
    paddingBottom: 10,
  },
  textInput: {
    borderColor: '#EEEEEE',
    width: 300,
    height: 60,
    borderWidth: 2,
    borderRadius: 30,
    padding: 10,
    fontFamily: 'muli',
  },
  sectionContainer2: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    marginTop: 10,
    height: 300,
  },
  sectionContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  headerSection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#bdc3c7',
    height: 60,
    alignItems: 'center',
    marginBottom: 10,
  },
  notfoundMessage: {
    backgroundColor: 'white',
    flex: 1,
    padding: 20,
    marginTop: 10,
  },
  bsitterContainer: {
    marginTop: 5,
  },
  bsitterItem: {
    flexDirection: 'row',
    marginTop: 10,
  },
  upperText: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginLeft: 15,
    flex: 1,
    alignItems: 'center',
  },
  lowerText: {
    marginLeft: 18,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  submitButton: {
    width: 300,
    height: 60,
    padding: 10,
    backgroundColor: '#315F61',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteButton: {
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 20,
    marginRight: 10,
  },
  bsitterName: {
    fontSize: 18,
    fontWeight: '400',
    color: '#315F61',
  },
  contentContainer: {
    paddingTop: 30,
  },
  buttonContainer: {
    paddingTop: 30,
    alignItems: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  sitterImage: {
    width: 65,
    height: 65,
    borderRadius: 20,
    resizeMode: 'contain',
  },
});
