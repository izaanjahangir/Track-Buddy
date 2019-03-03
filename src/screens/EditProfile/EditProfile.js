import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Content, Item, Input } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImagePicker } from 'expo';

import { setUser } from '../../redux/auth/action';

import CustomAvatar from '../../components/CustomAvatar';
import CustomButton from '../../components/CustomButton';
import CustomLoader from '../../components/CustomLoader';

import firebase from '../../config/firebase';

import variables from '../../config/variables';
import GeneralStyles from '../GeneralStyles';

class EditProfile extends Component {
    constructor() {
        super();

        this.state = {
            keyboardHeight: variables.WINDOW_WIDTH * 0.5,
            profilePicture: "",
            email: "",
            name: "",
            phoneNumber: "",
            isImageChanged: false
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Edit Profile",
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
        };
    }

    componentDidMount() {
        const { user } = this.props;

        this.props.navigation.setParams({ openDrawer: this.openDrawer });
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);

        this.setState({ ...user })
    }

    openDrawer = () => {
        this.props.navigation.openDrawer();
    }

    keyboardDidShow = (e) => {
        this.setState({ keyboardHeight: e.endCoordinates.height })
    }

    pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
            });

            if (!result.cancelled) {
                this.setState({ profilePicture: result.uri, isImageChanged: true });
            }
        }
        catch (e) {
            alert(e);
        }
    };

    saveChanges = async () => {
        this.setState({ isLoading: true });

        const { user, setUser } = this.props;
        const collection = `users`;
        const document = user.uid;
        let { profilePicture, email, name, phoneNumber, isImageChanged } = this.state;

        try {
            if (isImageChanged) {
                const url = await firebase.uploadImage(profilePicture, user.uid);
                profilePicture = url;
            }

            const data = { profilePicture, email, name, phoneNumber, isNew: false };

            await firebase.updateDocument(collection, document, data, true);

            isImageChanged = false;

            setUser({ ...user, ...data });
            alert("Profile Updated");
        }
        catch (e) {
            console.log("e =>", e);
            alert(e.message);
        }

        this.setState({ isLoading: false, isImageChanged });
    }

    render() {
        const { keyboardHeight, profilePicture, email, name, phoneNumber, isLoading } = this.state;

        return (
            <View style={GeneralStyles.flexFull}>
                <View style={GeneralStyles.container}>
                    <KeyboardAwareScrollView extraScrollHeight={keyboardHeight / 2.5} enableOnAndroid>
                        <ScrollView style={GeneralStyles.flexFull}>
                            <View style={[GeneralStyles.flexFull, GeneralStyles.mainContentPadding]}>
                                {
                                    !!profilePicture &&
                                    <TouchableOpacity onPress={this.pickImage} style={[GeneralStyles.alignItemsCenter, GeneralStyles.smallPaddingY]}>
                                        <CustomAvatar url={profilePicture} />
                                    </TouchableOpacity>
                                }
                                <Content>
                                    <Item regular style={GeneralStyles.smallMarginY}>
                                        <Input placeholder='Enter your name' value={name} onChangeText={(name) => this.setState({ name })} />
                                    </Item>
                                    <Item regular style={GeneralStyles.smallMarginY}>
                                        <Input placeholder='Enter your email' value={email} onChangeText={(email) => this.setState({ email })} />
                                    </Item>
                                    <Item regular style={GeneralStyles.smallMarginY}>
                                        <Input keyboardType="numeric" placeholder='Enter your phone number' value={phoneNumber} onChangeText={(phoneNumber) => this.setState({ phoneNumber })} />
                                    </Item>
                                    <View style={GeneralStyles.smallMarginY}>
                                        <CustomButton text="Save Profile" onPress={this.saveChanges} />
                                    </View>
                                </Content>
                            </View>
                        </ScrollView>
                    </KeyboardAwareScrollView>
                </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);