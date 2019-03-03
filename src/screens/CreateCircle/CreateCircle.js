import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setUser } from '../../redux/auth/action';

import GeneralStyles from '../GeneralStyles';

class CreateCircle extends Component {
    static navigationOptions = {
        title: "Create Circle"
    }
    
    async componentDidMount() {
        this.props.navigation.setParams({ openDrawer: this.openDrawer });
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    render() {
        return (
            <View style={GeneralStyles.flexFull}>
                <Text>Create Circle</Text>
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