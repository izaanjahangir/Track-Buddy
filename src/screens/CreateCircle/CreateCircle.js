import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Content, Input, Item } from 'native-base';

import CustomButton from '../../components/CustomButton';
import CustomLoader from '../../components/CustomLoader';

import firebase from '../../config/firebase';
import { setUser } from '../../redux/auth/action';

import GeneralStyles from '../GeneralStyles';
import helpers from '../../config/helpers';
import { isLoading } from 'expo-font';

class CreateCircle extends Component {
    constructor() {
        super();

        this.state = {
            circleName: "",
            code: "",
            isLoading: false
        }
    }

    static navigationOptions = {
        title: "Create Circle"
    }

    async componentDidMount() {
        this.props.navigation.setParams({ openDrawer: this.openDrawer });
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    createCircle = async () => {
        const { circleName } = this.state
        const { user, setUser } = this.props;
        let prevCircles = user.circles || [];


        try {
            this.setState({ isLoading: true });
            const code = helpers.createRandomString();

            const data = {
                members: [],
                admins: [
                    user.uid
                ],
                code,
                circleName,
                timeStamp: Date.now(),
                creatorId: user.uid
            }

            const response = await firebase.addDocument("circles", data);

            await firebase.updateUserCircle(user.uid, response.id);
            prevCircles.push(response.id);

            setUser({ ...user, circles: prevCircles });

            this.setState({ isLoading: false, code });
        } catch (e) {
            alert(e.message);
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { circleName, code, isLoading } = this.state;

        return (
            <View style={GeneralStyles.flexFull}>
                <View style={GeneralStyles.container}>
                    <Content style={{ marginTop: 50 }}>
                        <Item regular style={GeneralStyles.smallMarginY}>
                            <Input placeholder='Enter circle name' value={circleName} onChangeText={(circleName) => this.setState({ circleName })} />
                        </Item>
                        <View style={GeneralStyles.smallMarginY}>
                            <CustomButton text="Create Circle" onPress={this.createCircle} />
                        </View>
                        {
                            !!code &&
                            <View>
                                <Text>Your Circle code is: {code}</Text>
                            </View>
                        }
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
        setUser
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CreateCircle);