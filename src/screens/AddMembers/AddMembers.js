import React, { Component } from 'react'
import { Text, View, Image, Alert } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Content, Input, Item, Label } from 'native-base';

import CustomButton from '../../components/CustomButton';
import CustomLoader from '../../components/CustomLoader';

import helpers from '../../config/helpers';
import firebase from '../../config/firebase';
import { setUser } from '../../redux/auth/action';

import GeneralStyles from '../GeneralStyles';

class AddMembers extends Component {
    constructor() {
        super();

        this.state = {
            isLoading: false,
            phoneNumber: ""
        }
    }

    static navigationOptions = {
        title: "Add Members",
        headerStyle: GeneralStyles.headerStyle,
        headerTintColor: "#fff",
    }

    addMember = async () => {
        const { navigation, user } = this.props;
        const { selectedCircle } = navigation.state.params;
        const { phoneNumber } = this.state;

        try {
            this.setState({ isLoading: true });

            const data = {
                to: `+92${phoneNumber}`,
                subject: `You are invited by ${user.name} to join a circle in Track Buddy app, please enter this code in the app ${selectedCircle.code}`
            }

            await helpers.sendMessage(data);

            this.setState({ isLoading: false });

            Alert.alert("Woah!", "Invited to join in circle", [
                { text: 'Ok', onPress: () => this.props.navigation.navigate("Home") },
            ])
        } catch (e) {
            alert(e.message);
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { navigation } = this.props;
        const { selectedCircle } = navigation.state.params;
        const { phoneNumber, isLoading } = this.state;

        return (
            <View style={GeneralStyles.flexFull}>
                <View style={GeneralStyles.container}>
                    <Content style={{ marginTop: 50 }}>
                        <Text>Enter phone number to send invite:</Text>
                        <Text style={[GeneralStyles.textCenter, GeneralStyles.smallMarginY, GeneralStyles.smallText]}>Circle: {selectedCircle.circleName}</Text>
                        <Text style={[GeneralStyles.textCenter, GeneralStyles.smallMarginY, GeneralStyles.smallText]}>Circle Code: {selectedCircle.code}</Text>
                        <Item regular style={GeneralStyles.smallMarginY}>
                            <Input keyboardType="numeric" placeholder='Enter phone number' value={phoneNumber} onChangeText={(phoneNumber) => this.setState({ phoneNumber })} />
                        </Item>
                        <View style={GeneralStyles.smallMarginY}>
                            <CustomButton text="Add Member" onPress={this.addMember} />
                        </View>
                    </Content>
                </View>
                {
                    isLoading && <CustomLoader />
                }
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({
        setUser,
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AddMembers);