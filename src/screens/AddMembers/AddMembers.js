import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Content, Input, Item, Label } from 'native-base';

import CustomButton from '../../components/CustomButton';
import CustomLoader from '../../components/CustomLoader';

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
        title: "Add Members"
    }

    addMember = () => {
        console.log("add members")
    }

    render() {
        const { navigation } = this.props;
        const { selectedCircle } = navigation.state.params;
        const { phoneNumber } = this.state;

        return (
            <View style={GeneralStyles.flexFull}>
                <View style={GeneralStyles.container}>
                    <Content style={{ marginTop: 50 }}>
                        <Text>Enter phone number to add member:</Text>
                        <Text style={GeneralStyles.textCenter}>Circle: {selectedCircle.circleName}</Text>
                        <Item regular style={GeneralStyles.smallMarginY}>
                            <Input keyboardType="numeric" placeholder='Enter phone number' value={phoneNumber} onChangeText={(phoneNumber) => this.setState({ phoneNumber })} />
                        </Item>
                        <View style={GeneralStyles.smallMarginY}>
                            <CustomButton text="Add Member" onPress={this.addMember} />
                        </View>
                    </Content>
                </View>
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