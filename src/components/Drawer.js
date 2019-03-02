import React, { Component } from 'react'
import { Text, View, Image, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'native-base';
import { NavigationActions } from 'react-navigation';

import { setUser } from '../redux/auth/action';

import GeneralStyles from '../screens/GeneralStyles';
import variables from '../config/variables';

class Drawer extends Component {
    navigateToScreen = route => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    };

    render() {
        const { user } = this.props;

        return (
            user &&
            <View style={[GeneralStyles.flexFull]}>
                <View style={[GeneralStyles.bgPrimary, GeneralStyles.perfectlyCentered, Styles.drawerTopArea]}>
                    <Image source={{ uri: user.profilePicture }} style={Styles.avatar} />
                    <Text style={[GeneralStyles.smallText, Styles.avatarText]}>{user.name}</Text>
                </View>
                <View style={GeneralStyles.flexFull}>
                    <Button onPress={this.navigateToScreen.bind(this, "Home")} light block>
                        <Text>Home</Text>
                    </Button>
                    <Button onPress={this.navigateToScreen.bind(this, "EditProfile")} light block>
                        <Text>Edit Profile</Text>
                    </Button>
                </View>
            </View >
        )
    }
}

const Styles = StyleSheet.create({
    drawerTopArea: { height: variables.WINDOW_HEIGHT * 0.4 },
    avatar: {
        width: (variables.WINDOW_HEIGHT * 0.4) / 2,
        height: (variables.WINDOW_HEIGHT * 0.4) / 2,
        borderRadius: (variables.WINDOW_HEIGHT * 0.4) / 2
    },
    avatarText: {
        marginTop: 10,
    }
})

const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({
        setUser
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
