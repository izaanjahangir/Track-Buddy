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

class JoinCircle extends Component {
    constructor() {
        super();

        this.state = {
            isLoading: false,
            code: ""
        }
    }

    static navigationOptions = {
        title: "Join Circle",
        headerStyle: GeneralStyles.headerStyle,
        headerTintColor: "#fff",
    }

    join = () => {
        console.log("join")
    }

    render() {
        const { code } = this.state;

        return (
            <View style={GeneralStyles.flexFull}>
                <View style={GeneralStyles.container}>
                    <Content style={{ marginTop: 50 }}>
                        <Text>Enter your circle code to join:</Text>
                        <Item regular style={GeneralStyles.smallMarginY}>
                            <Input keyboardType="numeric" placeholder='Enter circle code' value={code} onChangeText={(phoneNumber) => this.setState({ phoneNumber })} />
                        </Item>
                        <View style={GeneralStyles.smallMarginY}>
                            <CustomButton text="Join" onPress={this.join} />
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

export default connect(mapStateToProps, mapDispatchToProps)(JoinCircle);