import React, { Component } from 'react'
import { Image, StyleSheet } from 'react-native'

import variables from '../config/variables';

export default class CustomAvatar extends Component {
    render() {
        const { url } = this.props;

        return (
            <Image source={{ uri: url }} style={Styles.avatar} />
        )
    }
}

const Styles = StyleSheet.create({
    avatar: {
        width: variables.WINDOW_WIDTH * 0.45,
        height: variables.WINDOW_WIDTH * 0.45,
        borderRadius: variables.WINDOW_WIDTH * 0.25
    }
})