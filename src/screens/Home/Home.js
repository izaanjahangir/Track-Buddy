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
            region: null,
            isLoadingCircle: false,
            selectedCircle: ""
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Home",
            headerStyle: GeneralStyles.headerStyle,
            headerTintColor: "#fff",
            headerLeft: (
                <TouchableOpacity style={{ marginLeft: 10 }} onPress={navigation.getParam('openDrawer')}>
                    <Image
                        source={require("../../assets/menu-icon.png")}
                        style={{ width: 35, height: 35 }}
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
                    <TouchableOpacity style={{ marginRight: 10 }} onPress={navigation.getParam('navigateToJoin')}>
                        <Image
                            source={require("../../assets/join.png")}
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
                    navigateToAddMembers: this.navigateToAddMembers,
                    navigateToJoin: this.navigateToJoin
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
            console.log("componentDidMount")
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
        let { selectedCircle, isLoadingCircle, isAdmin } = this.state;

        if (!selectedCircle) {
            alert("Please select a circle first!");
            return
        }

        if (isLoadingCircle) {
            alert("Please wait a moment, we are fetching data");
            return
        }

        if (!isAdmin) {
            alert("Sorry! you are not an admin of this circle");
            return;
        }

        this.props.navigation.navigate("AddMembers", { selectedCircle })
    }

    navigateToJoin = () => {
        this.props.navigation.navigate("JoinCircle")
    }

    onValueChange2(value) {
        if (value.circleId) {
            this.getCircle(value.circleId);
        }

        this.setState({
            selectedCircle: value
        });
    }

    getCircle = async (circleId) => {
        try {
            this.setState({ isLoadingCircle: true });
            const { user } = this.props;
            const response = await firebase.readDocument("circles", circleId, "data");
            let isAdmin = false;

            if (response && response.admins.includes(user.uid)) {
                isAdmin = true;
            }

            this.setState({ isLoadingCircle: false, isAdmin, circleData: response });
        } catch (e) {
            console.log("getCircle ")
            alert(e.message);
            this.setState({ isLoadingCircle: false });
        }
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
                                        <Picker.Item label="Select Circle" value="" />
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