import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Button } from 'native-base';

import GeneralStyles from '../screens/GeneralStyles';

export default class CustomButton extends Component {
    render() {
        const { text, onPress, type } = this.props;

        if(type !== "danger"){
            return (
                <Button onPress={onPress} primary block>
                    <Text style={GeneralStyles.textWhite}>{text}</Text>
                </Button>
            )
        }
        else{
            return (
                <Button onPress={onPress} danger block>
                    <Text style={GeneralStyles.textWhite}>{text}</Text>
                </Button>
            )
        }
    }
}
