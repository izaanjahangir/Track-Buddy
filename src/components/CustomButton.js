import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Button } from 'native-base';

import GeneralStyles from '../screens/GeneralStyles';

export default class CustomButton extends Component {
    render() {
        const { text, onPress } = this.props;

        return (
            <Button onPress={onPress} primary block>
                <Text style={GeneralStyles.textWhite}>{text}</Text>
            </Button>
        )
    }
}
