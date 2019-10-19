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
export default class ProfileDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
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


    render() {
        return (
            <ScrollView>
                <View style={{
                    flexDirection: 'row',
                    marginHorizontal: 25,
                    marginTop: 25
                }}>
                    <Image source={this.state.detailPictureSitter} style={styles.profileImg} ></Image>
                    <View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <MuliText style={{ marginLeft: 10 }}>Name - age -</MuliText>
                            <Ionicons
                                name="ios-male"
                                size={20}
                                style={{ marginLeft: 5 }}
                                color={colors.blueAqua}
                            />
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons
                                    name="ios-pin"
                                    size={20}
                                    style={{ marginLeft: 10 }}
                                    color={colors.lightGreen}
                                />
                                <MuliText style={{ marginLeft: 3 }}> Distance km </MuliText>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Ionicons
                                    name="ios-star"
                                    size={20}
                                    style={{ marginLeft: 7 }}
                                    color={colors.lightGreen}
                                />
                                <MuliText> Rating </MuliText>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={{ alignContent: "center", marginLeft: 'auto', marginTop: 10 }}>
                        <Ionicons
                            name="ios-heart-empty"
                            size={30}
                            color={colors.lightGreen}
                        />
                        <MuliText style={{ color: colors.lightGreen }}>Like </MuliText>
                    </TouchableOpacity>
                </View>
                <MuliText style={{ marginHorizontal: 25, marginTop: 10 }}>Địa chỉ: bí mật :]]</MuliText>
                <View
                    style={styles.line}
                />
                <View style={{
                    marginHorizontal: 25,
                    flexDirection: 'row',
                    marginTop: 10
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Ionicons
                            name="ios-person-add"
                            size={20}
                            color={colors.lightGreen}
                        />
                        <MuliText > 4 lượt giữ trẻ </MuliText>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Ionicons
                            name="ios-chatbubbles"
                            size={20}
                            color={colors.lightGreen}
                            style={{ marginLeft: 10 }}
                        />
                        <MuliText> 3 đánh giá </MuliText>
                    </View>
                </View>
                <View style={{
                    marginTop: 10,
                    marginHorizontal: 25
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image resizeMode="stretch" source={this.state.detailPictureChildren} style={styles.profileImg2} ></Image>
                        <Image resizeMode="stretch" source={this.state.detailPictureChildren} style={styles.profileImg2} ></Image>
                    </View>
                    <MuliText style={{ marginTop: 10 }}>Bla bla bla bla bla bla Bla bla bla bla bla blaBl
                    a bla bla bla bla blaBla bla bla bla bla blaBla bla bla bla bla bla
                    </MuliText>
                </View>
                <View
                    style={styles.line}
                />
                <View style={styles.detailContainer}>
                    <MuliText style={styles.headerTitle}>Tùy chọn</MuliText>
                    <View style={styles.informationText}>
                        <Ionicons
                            name="ios-cash"
                            size={22}
                            style={{ marginBottom: -5, marginHorizontal: 5 }}
                            color={colors.gray}
                        />
                        <View style={styles.textOption}>
                            <MuliText style={styles.optionInformation}>
                                Thanh toán bằng thẻ
                </MuliText>
                        </View>
                    </View>

                    <View style={styles.informationText}>
                        <Ionicons
                            name="ios-car"
                            size={22}
                            style={{ marginBottom: -5, marginHorizontal: 5 }}
                            color={colors.gray}
                        />
                        <View style={styles.textOption}>
                            <MuliText style={styles.optionInformation}>
                                Người giữ trẻ không có xe
                </MuliText>
                        </View>
                    </View>

                    <View style={styles.informationText}>
                        <Ionicons
                            name="ios-text"
                            size={22}
                            style={{ marginBottom: -5, marginHorizontal: 5 }}
                            color={colors.gray}
                        />
                        <View style={styles.textOption}>
                            <MuliText style={styles.optionInformation}>Có thể nói được tiếng Việt, tiếng Anh</MuliText>
                        </View>
                    </View>

                    <View style={styles.informationText}>
                        <Ionicons
                            name="ios-man"
                            size={22}
                            style={{ marginBottom: -5, marginHorizontal: 10 }}
                            color={colors.gray}
                        />
                        <View style={styles.textOption}>
                            <MuliText style={styles.optionInformation}>
                                Có lí lịch trong sạch
         </MuliText>
                        </View>
                    </View>
                </View>
                <View style={styles.detailContainer}>
                    <MuliText style={styles.headerTitle}>Kỹ năng</MuliText>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.childrenInformationContainer}>
                                <View style={{ flexDirection: 'row', marginTop: 25 }}>
                                    <Ionicons
                                        name='ios-man'
                                        size={22}
                                        style={{ marginBottom: -5, marginLeft: 15 }}
                                        color="#adffcb"
                                    />
                                    <View>
                                        <MuliText style={{ marginLeft: 10, fontSize: 15 }}>1</MuliText>
                                    </View>
                                </View>
                                <MuliText style={styles.grayOptionInformation}>Chém gió</MuliText>
                            </View>
                            <View style={styles.childrenInformationContainer}>
                                <View style={{ flexDirection: 'row', marginTop: 25 }}>
                                    <Ionicons
                                        name='ios-happy'
                                        size={22}
                                        style={{ marginBottom: -5, marginLeft: 15 }}
                                        color="#adffcb"
                                    />
                                    <View>
                                        <MuliText style={{ marginLeft: 10, fontSize: 15 }}>2</MuliText>
                                    </View>
                                </View>
                                <MuliText style={styles.grayOptionInformation}>Chăm sóc trẻ khi bị bệnh</MuliText>
                            </View>
                            <View style={styles.childrenInformationContainer}>
                                <View style={{ flexDirection: 'row', marginTop: 25 }}>
                                    <Ionicons
                                        name='ios-man'
                                        size={22}
                                        style={{ marginBottom: -5, marginLeft: 15 }}
                                        color="#adffcb"
                                    />
                                    <View>
                                        <MuliText style={{ marginLeft: 10, fontSize: 15 }}>3</MuliText>
                                    </View>
                                </View>
                                <MuliText style={styles.grayOptionInformation}>Dạy học cho trẻ</MuliText>
                            </View>
                            <View style={styles.childrenInformationContainer}>
                                <View style={{ flexDirection: 'row', marginTop: 25 }}>
                                    <Ionicons
                                        name='ios-man'
                                        size={22}
                                        style={{ marginBottom: -5, marginLeft: 15 }}
                                        color="#adffcb"
                                    />
                                    <View>
                                        <MuliText style={{ marginLeft: 10, fontSize: 15 }}>4</MuliText>
                                    </View>
                                </View>
                                <MuliText style={styles.grayOptionInformation}>Nấu ăn cực ngon</MuliText>
                            </View>
                            <View style={styles.childrenInformationContainer}>
                                <View style={{ flexDirection: 'row', marginTop: 25 }}>
                                    <Ionicons
                                        name='ios-man'
                                        size={22}
                                        style={{ marginBottom: -5, marginLeft: 15 }}
                                        color="#adffcb"
                                    />
                                    <View>
                                        <MuliText style={{ marginLeft: 10, fontSize: 15 }}>5</MuliText>
                                    </View>
                                </View>
                                <MuliText style={styles.grayOptionInformation}>Hài hước</MuliText>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View
                    style={styles.line}
                />
                <View style={styles.detailContainer}>
                    <MuliText style={styles.headerTitle}>Đánh giá</MuliText>
                    <View style={styles.reivewContainer}>
                        <Image source={this.state.detailPictureSitter} style={styles.profileImg} ></Image>
                        <View>
                            <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                                <MuliText style={styles.nameReview}>Dương</MuliText>
                                <MuliText style={{ marginLeft: 5 }}>rated</MuliText>
                                <View style={{ flexDirection: 'row', marginLeft: 4 }}>
                                    <MuliText> 3 </MuliText>
                                    <Ionicons
                                        name="ios-star"
                                        size={20}
                                        style={{ marginLeft: 2 }}
                                        color={colors.lightGreen}
                                    />
                                </View>
                            </View>
                            <View style={styles.textReview}>
                                <MuliText numberOfLines={3} >Chỉnh sửa api google, Làm con tôi té, trừ điểm</MuliText>
                            </View>

                        </View>

                    </View>
                    <View style={styles.reivewContainer}>
                        <Image source={this.state.detailPictureSitter} style={styles.profileImg} ></Image>
                        <View>
                            <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                                <MuliText style={styles.nameReview}>Đông</MuliText>
                                <MuliText style={{ marginLeft: 5 }}>rated</MuliText>
                                <View style={{ flexDirection: 'row', marginLeft: 4 }}>
                                    <MuliText> 5 </MuliText>
                                    <Ionicons
                                        name="ios-star"
                                        size={20}
                                        style={{ marginLeft: 2 }}
                                        color={colors.lightGreen}
                                    />
                                </View>
                            </View>
                            <View style={styles.textReview}>
                                <MuliText numberOfLines={3} >Đẹp trai</MuliText>
                            </View>

                        </View>

                    </View>
                    <View style={styles.reivewContainer}>
                        <Image source={this.state.detailPictureSitter} style={styles.profileImg} ></Image>
                        <View>
                            <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                                <MuliText style={styles.nameReview}>Kỳ</MuliText>
                                <MuliText style={{ marginLeft: 5 }}>rated</MuliText>
                                <View style={{ flexDirection: 'row', marginLeft: 4 }}>
                                    <MuliText> 5 </MuliText>
                                    <Ionicons
                                        name="ios-star"
                                        size={20}
                                        style={{ marginLeft: 2 }}
                                        color={colors.lightGreen}
                                    />
                                </View>
                            </View>
                            <View style={styles.textReview}>
                                <MuliText numberOfLines={3} >Nuôi trẻ mập còn hơn ba nó</MuliText>
                            </View>

                        </View>

                    </View>
                </View>
            </ScrollView>
        );
    }
}
ProfileDetail.navigationOptions = {
    title: "Profile detail"
};

const styles = StyleSheet.create({
    textReview: {
        marginLeft: 8,
        marginRight: 100,
        flex: 1,
    },
    line: {
        borderBottomColor: colors.gray,
        borderBottomWidth: 1,
        marginTop: 10,
        marginHorizontal: 25,
    },
    reivewContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    nameReview: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#315F61',
    },
    optionInformation: {
        color: '#bdc3c7',
        fontSize: 13,
        paddingLeft: 15,
        fontWeight: '400'
    },
    textOption: {
        marginHorizontal: 5,
    },
    informationText: {
        fontSize: 13,
        marginTop: 20,
        flexDirection: 'row',
        color: '#bdc3c7'
        // backgroundColor: 'red',
    },
    headerTitle: {
        fontSize: 15,
        color: "#315F61",
        marginBottom: 10,
        fontWeight: "800",
    },
    detailContainer: {
        marginHorizontal: 25,
        marginTop: 20
    },
    profileImg2: {
        width: 60,
        height: 70,
        borderRadius: 50,
        overflow: "hidden",
        borderWidth: 1,
        marginLeft: 10,
    },
    profileImg: {
        width: 80,
        height: 80,
        borderRadius: 140 / 2,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "black"
    },
    childrenInformationContainer: {
        flex: 1,
        backgroundColor: 'white',
        marginHorizontal: 15,
        marginTop: 15,
        marginBottom: 5,
        borderRadius: 15,
        height: 100,
        width: 160,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 1,
    },
    grayOptionInformation: {
        color: '#bdc3c7',
        fontSize: 11,
        paddingLeft: 15,
        fontWeight: '200',
        marginTop: 10,
    },
});
