import React, { Component } from 'react'
import { Text, View, ImageBackground } from 'react-native'
import { Button, Icon } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setUser } from '../../redux/auth/action';

import GeneralStyles from '../GeneralStyles';

class Home extends Component {
    render() {
        return (
            <View style={[GeneralStyles.container]}>
                <Text>Home</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);