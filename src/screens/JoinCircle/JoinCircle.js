import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Content, Input, Item, Label } from 'native-base';

import CustomButton from '../../components/CustomButton';
import CustomLoader from '../../components/CustomLoader';

import firebase from '../../config/firebase';
import { setUser } from '../../redux/auth/action';

import GeneralStyles from '../GeneralStyles';
import helpers from '../../config/helpers';

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

    join = async () => {
        const { code } = this.state;
        const { navigation, user, setUser } = this.props;

        try {
            this.setState({ isLoading: true });

            const response = await firebase.findCircle(code);

            if (!response.empty) {
                let responseData;

                response.forEach(r => responseData = { ...r.data(), circleId: r.id })
                const prevCircles = user.circles || [];

                if (responseData.members.includes(user.uid)) {
                    throw { message: "you are already a member" }
                }

                const members = responseData.members || [];

                members.push(user.uid);
                prevCircles.push({ circleName: responseData.circleName, circleId: responseData.circleId, code: responseData.code });
                let location = await helpers.getLocation();

                const promises = [
                    firebase.updateDocument("users", user.uid, { circles: prevCircles }, true),
                    firebase.updateDocument("circles", responseData.circleId, { members }, true),
                    firebase.updateLocationCircle(responseData.circleId, user.uid, { ...location, timeStamp: Date.now() }),
                ];

                await Promise.all(promises);

                setUser({ ...user, circles: prevCircles })
                this.setState({ isLoading: false });

                Alert.alert(
                    'Woah!',
                    'You Joined this circle',
                    [
                        { text: 'OK', onPress: () => this.props.navigation.navigate("Home") },
                    ],
                    { cancelable: false },
                );
            }
            else {
                throw { message: "Code is not correct" }
            }
        }
        catch (e) {
            console.log("join")
            this.setState({ isLoading: false });
            alert(e.message);
        }
    }

    render() {
        const { code, isLoading } = this.state;

        return (
            <View style={GeneralStyles.flexFull}>
                <View style={GeneralStyles.container}>
                    <Content style={{ marginTop: 50 }}>
                        <Text>Enter your circle code to join:</Text>
                        <Item regular style={GeneralStyles.smallMarginY}>
                            <Input placeholder='Enter circle code' value={code} onChangeText={(code) => this.setState({ code })} />
                        </Item>
                        <View style={GeneralStyles.smallMarginY}>
                            <CustomButton text="Join" onPress={this.join} />
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

export default connect(mapStateToProps, mapDispatchToProps)(JoinCircle);