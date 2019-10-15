import React, { Component } from "react";
import { Button, Text, View } from "react-native";
import Modal from "react-native-modal";
import { MuliText } from "components/StyledText";

export default class ModalTester extends Component {
    state = {
        isModalVisible: false
    };

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Button title="Show modal" onPress={this.toggleModal} />
                <Modal isVisible={this.state.isModalVisible} hasBackdrop={true} backdropColor='blue' backdropOpacity={20} onBackdropPress={this.toggleModal}>
                    <View style={{ flex: 0.2, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' }}>
                        <MuliText>Please input your Authentication Code</MuliText>
                        <View style={styles.textContainer}>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={text => this.setState({ phoneNumber: text })}
                                placeholder='Username'
                                disableFullscreenUI={false}
                                value={this.state.phoneNumber}
                                textContentType='username'
                            />
                        </View>
                        <Button title="Hide modal" onPress={this.toggleModal} />
                    </View>
                </Modal>
            </View>
        );
    }
}