import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MapView from 'react-native-maps';
import { Container, Header, Content, Form, Item, Picker } from 'native-base';

import firebase from '../../config/firebase';
import helpers from '../../config/helpers';
import { setUser } from '../../redux/auth/action';

import Styles from './Styles';
import GeneralStyles from '../GeneralStyles';
import variables from '../../config/variables';

class Home extends Component {
    constructor() {
        super();

        this.state = {
            region: null
        }
    }

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
            headerRight: (
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={navigation.getParam('navigateToAddMembers')}>
                        <Image
                            source={require("../../assets/person.png")}
                            style={{ width: 30, height: 30 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={navigation.getParam('navigateToCreateCircle')}>
                        <Image
                            source={require("../../assets/add.png")}
                            style={{ width: 30, height: 30 }}
                        />
                    </TouchableOpacity>
                </View>
            ),
        };
    }

    async componentDidMount() {
        try {
            const { user } = this.props;
            this.props.navigation.setParams(
                {
                    openDrawer: this.openDrawer,
                    navigateToCreateCircle: this.navigateToCreateCircle,
                    navigateToAddMembers: this.navigateToAddMembers
                });

            const location = await helpers.getLocation();

            const region = {
                ...location,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }

            this.setState({ region })

            if (user.isNew) {
                this.props.navigation.navigate("EditProfile");
            }

        } catch (e) {
            alert(e.message);
        }
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    navigateToCreateCircle = () => {
        this.props.navigation.navigate("CreateCircle")
    }

    navigateToAddMembers = () => {
        const { user } = this.props
        let { selectedCircle } = this.state;

        if (!selectedCircle) {
            selectedCircle = user.circles[0]
        }

        this.props.navigation.navigate("AddMembers", { selectedCircle })
    }

    onValueChange2(value) {
        this.setState({
            selectedCircle: value
        });
    }

    render() {
        const { user } = this.props;
        const { region, selectedCircle } = this.state;

        return (
            <View style={GeneralStyles.flexFull}>
                {
                    region &&
                    <View style={[GeneralStyles.flexFull, { position: 'relative' }]}>
                        <MapView
                            style={GeneralStyles.flexFull}
                            initialRegion={this.state.region}
                            showsUserLocation
                        />
                        {
                            !!user.circles.length &&
                            <View style={[Styles.picker]}>
                                <Item picker>
                                    <Picker
                                        mode="dropdown"
                                        style={{ width: undefined }}
                                        placeholderIconColor="#007aff"
                                        selectedValue={selectedCircle}
                                        onValueChange={this.onValueChange2.bind(this)}
                                    >
                                        {
                                            user.circles.map(c => {
                                                return (
                                                    <Picker.Item label={c.circleName} value={c} />
                                                )
                                            })
                                        }
                                    </Picker>
                                </Item>
                            </View>
                        }
                    </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);