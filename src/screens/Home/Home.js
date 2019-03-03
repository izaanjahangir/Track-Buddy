import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Location } from 'expo';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MapView, { Marker } from 'react-native-maps';
import { Container, Header, Content, Form, Item, Picker } from 'native-base';
import firebaseLib from 'firebase/app';
import 'firebase/firestore'

import firebase from '../../config/firebase';
import helpers from '../../config/helpers';
import { setUser } from '../../redux/auth/action';

import CustomButton from '../../components/CustomButton';

import Styles from './Styles';
import GeneralStyles from '../GeneralStyles';
import variables from '../../config/variables';

class Home extends Component {
    constructor() {
        super();

        this.state = {
            region: null,
            isLoadingCircle: false,
            locations: [],
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
        const { user, setUser } = this.props;

        try {
            this.watchLocation();

            const { user } = this.props;
            this.props.navigation.setParams(
                {
                    openDrawer: this.openDrawer,
                    navigateToCreateCircle: this.navigateToCreateCircle,
                    navigateToAddMembers: this.navigateToAddMembers,
                    navigateToJoin: this.navigateToJoin
                });

            const token = await helpers.retriveToken();
            setUser({ ...user, token });
            const location = await helpers.getLocation();

            const region = {
                ...location,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }

            firebase.updateDocument("users", user.uid, { token }, true);

            this.setState({ region })

            if (user.isNew) {
                this.props.navigation.navigate("EditProfile");
            }

        } catch (e) {
            console.log("componentDidMount")
            alert(e.message);
        }
    }

    watchLocation = async () => {
        const { user } = this.props;

        try {
            this.interval = setInterval(async () => {
                const location = await helpers.getLocation();

                user.circles.forEach(u => {
                    data = { latitude: location.latitude, longitude: location.longitude, timeStamp: Date.now() };
                    firebase.updateNestedDocument("locations", u.circleId, "users", user.uid, data, true);
                })
            }, 60000);

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
            if (this.listener) {
                this.listener();

            }

            this.getCircle(value.circleId);
        }

        this.setState({
            selectedCircle: value
        });
    }

    componentWillUnmount() {
        if (this.listener) {
            clearInterval(this.listener)
        }
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

            this.listener = firebaseLib.firestore()
                .collection("locations")
                .doc(circleId)
                .collection("users")
                .onSnapshot(querySnapshot => {
                    let locations = [];

                    querySnapshot.forEach(q => {
                        console.log("q.data() =>", q.data())
                        if (q.data().user.uid !== user.uid) {
                            locations.push(q.data())
                        }
                    })

                    this.setState({ locations });
                })

            this.setState({ isLoadingCircle: false, isAdmin, circleData: response });
        } catch (e) {
            alert(e.message);
            this.setState({ isLoadingCircle: false });
        }
    }

    danger = async () => {
        try {
            const { selectedCircle } = this.state;
            const { user } = this.props;

            const circleData = await firebase.readDocument("circles", selectedCircle.circleId, "data");

            const promises = [];

            circleData.members.forEach(id => promises.push(firebase.readDocument("users", id, "data")));

            const responseArr = await Promise.all(promises);
            const data = [];

            responseArr.forEach(r => {
                if (r.token && r.token !== user.token) {
                    data.push(
                        {
                            title: `I am in danger`,
                            body: `${user.name} needs your help`,
                            to: r.token
                        }
                    )
                }
            })

            await helpers.sendNotifications(data);
        }
        catch (e) {
            alert(e.message)
        }
    }

    render() {
        const { user } = this.props;
        const { region, selectedCircle, locations } = this.state;

        return (
            <View style={GeneralStyles.flexFull}>
                {
                    region &&
                    <View style={[GeneralStyles.flexFull, { position: 'relative' }]}>
                        <MapView
                            style={GeneralStyles.flexFull}
                            initialRegion={this.state.region}
                            showsUserLocation
                        >
                            {locations.map(marker => (
                                <Marker
                                    coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                                    title={marker.user.name}
                                    flat={true}
                                    style={{ width: 60, height: 60 }}
                                    key={Math.random().toString()}
                                >
                                    <View
                                        style={{
                                            width: 60,
                                            height: 60,
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Image
                                            source={require("../../assets/favorite.png")}
                                            style={{ width: 50, height: 50 }}
                                        />
                                        <View style={{ position: "absolute", top: 10 }}>
                                            <Image
                                                source={{ uri: marker.user.profilePicture }}
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: 1000
                                                }}
                                            />
                                        </View>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                        {
                            user.circles && !!user.circles.length &&
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
                                                    <Picker.Item key={`${Math.random()}`} label={c.circleName} value={c} />
                                                )
                                            })
                                        }
                                    </Picker>
                                </Item>
                            </View>
                        }
                        {
                            !!selectedCircle &&
                            <View style={Styles.absoluteButton}>
                                <CustomButton type="danger" text="I am in danger" onPress={this.danger} danger />
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