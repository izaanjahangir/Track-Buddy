import React, { Component } from 'react'
import { Text, View, ImageBackground } from 'react-native'
import { Button, Icon } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setUser } from '../../redux/auth/action';

import facebook from '../../config/facebook';

import GeneralStyles from '../GeneralStyles';

class Login extends Component {
    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        const { user } = this.props;

        if (user) {
            this.props.navigation.navigate("Drawer");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            this.props.navigation.navigate("Drawer");
        }
    }

    login = async () => {
        const { setUser } = this.props;

        try {
            const response = await facebook.loginWithFacebook();

            setUser(response);
        } catch (e) {
        }
    }

    render() {
        return (
            <ImageBackground resizeMode="cover" source={require("../../assets/main-splash.png")} style={GeneralStyles.fullWidthHeight}>
                <View style={[GeneralStyles.justifyContentEnd, GeneralStyles.container]}>
                    <View style={GeneralStyles.mediumPaddingBottom}>
                        <Button onPress={this.login} block info>
                            <Icon name='logo-facebook' />
                            <Text>Login With facebook</Text>
                        </Button>
                    </View>
                </View>
            </ImageBackground>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);