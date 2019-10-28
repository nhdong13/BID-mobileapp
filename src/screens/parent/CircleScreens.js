import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import images from 'assets/images/images';
import { MuliText } from 'components/StyledText';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import colors from 'assets/Color';
import { CheckBox } from 'native-base';
export default class CircleScreens extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.sectionContainer}>
          <View style={styles.headerSection}>
            <Ionicons
              name={
                this.state.isModalVisible ? 'ios-arrow-down' : 'ios-arrow-up'
              }
              size={24}
              style={{ marginBottom: -6, marginLeft: 20 }}
              color="#315f61"
            />
            <MuliText
              style={{ fontSize: 18, color: '#315f61', marginLeft: 10 }}
            >
              Vòng tròn tin tưởng của tôi()
            </MuliText>
          </View>
          <ScrollView style={styles.sectionContainer2}>
            {/*  */}
            <View style={styles.bsitterContainer}>
              <View style={styles.bsitterItem}>
                <TouchableOpacity style={{ flexDirection: 'row', flexGrow: 2 }}>
                  <Image source={images.parent} style={styles.sitterImage} />
                  <View>
                    <View style={styles.upperText}>
                      <MuliText style={styles.bsitterName}>Ky - 23</MuliText>
                      <Ionicons
                        name="ios-male"
                        size={20}
                        style={{ marginBottom: -2, marginLeft: 20 }}
                        color={colors.blueAqua}
                      />
                    </View>
                    <View style={styles.lowerText}>
                      <Ionicons
                        name="ios-pin"
                        size={24}
                        style={{ marginBottom: -4, marginLeft: 20 }}
                        color={colors.lightGreen}
                      />
                      <MuliText> 2 km </MuliText>
                      <Ionicons
                        name="ios-star"
                        size={24}
                        style={{ marginBottom: -4, marginLeft: 20 }}
                        color={colors.lightGreen}
                      />
                      <MuliText> 2 </MuliText>
                    </View>
                  </View>
                </TouchableOpacity>
                <View />
                <TouchableOpacity style={styles.inviteButton}>
                  <CheckBox checked={true} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.headerSection}>
            <Ionicons
              name={
                this.state.isModalVisible2 ? 'ios-arrow-down' : 'ios-arrow-up'
              }
              size={24}
              style={{ marginBottom: -6, marginLeft: 20 }}
              color="#315f61"
            />
            <MuliText
              style={{ fontSize: 18, color: '#315f61', marginLeft: 10 }}
            >
              Bạn bè ()
            </MuliText>
          </View>
          <ScrollView style={styles.sectionContainer2}>
            <View style={styles.bsitterContainer}>
              <View style={styles.bsitterItem}>
                <TouchableOpacity style={{ flexDirection: 'row', flexGrow: 2 }}>
                  <Image source={images.parent} style={styles.sitterImage} />
                  <View>
                    <View style={styles.upperText}>
                      <MuliText style={styles.bsitterName}>Ky - 23</MuliText>
                      <Ionicons
                        name="ios-male"
                        size={20}
                        style={{ marginBottom: -2, marginLeft: 20 }}
                        color={colors.blueAqua}
                      />
                    </View>
                    <View style={styles.lowerText}>
                      <Ionicons
                        name="ios-pin"
                        size={24}
                        style={{ marginBottom: -4, marginLeft: 20 }}
                        color={colors.lightGreen}
                      />
                      <MuliText> 2 km </MuliText>
                      <Ionicons
                        name="ios-star"
                        size={24}
                        style={{ marginBottom: -4, marginLeft: 20 }}
                        color={colors.lightGreen}
                      />
                      <MuliText> 2 </MuliText>
                    </View>
                  </View>
                </TouchableOpacity>
                <View />
                <TouchableOpacity style={styles.inviteButton}>
                  <CheckBox checked={true} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  },
  upperText: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginLeft: 15,
    flex: 1,
    alignItems: 'center',
  },
  lowerText: {
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
    marginTop: 10,
    marginRight: 15,
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
