import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'native-base';
import { NavigationActions } from 'react-navigation';

import { removeUser } from '../redux/auth/action';

import GeneralStyles from '../screens/GeneralStyles';
import variables from '../config/variables';

class Drawer extends Component {
    navigateToScreen = route => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    };

    logout = () => {
        const { removeUser } = this.props;

        removeUser();
        this.props.navigation.navigate("Login");
    }

    render() {
        const { user } = this.props;

        return (
            user &&
            <View style={[GeneralStyles.flexFull]}>
                <View style={[GeneralStyles.bgPrimary, GeneralStyles.perfectlyCentered, Styles.drawerTopArea]}>
                    <Image source={{ uri: user.profilePicture }} style={Styles.avatar} />
                    <Text style={[GeneralStyles.smallText, Styles.avatarText, GeneralStyles.textWhite]}>{user.name}</Text>
                </View>
                <View style={GeneralStyles.flexFull}>
                    <View style={GeneralStyles.flexRow}>
                        <TouchableOpacity onPress={this.navigateToScreen.bind(this, "Home")} style={GeneralStyles.fullWidthBtn}>
                            <Text>Home</Text>
                        </TouchableOpacity>
                    </View>
                    <View onPress={this.navigateToScreen.bind(this, "EditProfile")} style={GeneralStyles.flexRow}>
                        <TouchableOpacity style={GeneralStyles.fullWidthBtn}>
                            <Text>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={GeneralStyles.flexRow}>
                        <TouchableOpacity onPress={this.logout} style={GeneralStyles.fullWidthBtn}>
                            <Text>Log out</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <Button onPress={this.navigateToScreen.bind(this, "Home")} light block>
                        <Text>Home</Text>
                    </Button>
                    <Button onPress={this.navigateToScreen.bind(this, "EditProfile")} light block>
                        <Text>Edit Profile</Text>
                    </Button>
                    <Button onPress={this.logout} light block>
                        <Text>Log out</Text>
                    </Button> */}
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
        removeUser
    }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
