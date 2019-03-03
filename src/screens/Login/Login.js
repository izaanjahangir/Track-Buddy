import React, { Component } from 'react'
import { Text, View, ImageBackground } from 'react-native'
import { Button, Icon } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setUser } from '../../redux/auth/action';

import CustomLoader from '../../components/CustomLoader';

import facebook from '../../config/facebook';

import GeneralStyles from '../GeneralStyles';

class Login extends Component {
    constructor() {
        super();

        this.state = {
            isLoading: false
        }
    }

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
            this.setState({ isLoading: true });

            const response = await facebook.loginWithFacebook();

            setUser(response);
            this.setState({ isLoading: false });
        } catch (e) {
            alert(e.message)
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { isLoading } = this.state;

        return (
            <View style={GeneralStyles.flexFull}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);