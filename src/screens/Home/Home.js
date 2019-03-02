import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setUser } from '../../redux/auth/action';

import GeneralStyles from '../GeneralStyles';

class Home extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Home",
            headerLeft: (
                <TouchableOpacity style={{ marginLeft: 10 }} onPress={navigation.getParam('openDrawer')}>
                    <Image
                        source={require("../../assets/menu-icon.png")}
                        style={{ width: 30, height: 30 }}
                    />
                </TouchableOpacity>
            ),
        };
    }

    componentDidMount() {
        const { user } = this.props;
        this.props.navigation.setParams({ openDrawer: this.openDrawer });

        if (user.isNew) {
            this.props.navigation.navigate("EditProfile");
        }
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

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