import React, { Component } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

import colors from '../config/colors';

export default class CustomLoader extends Component {
    render() {
        return (
            <View style={Styles.LoaderContainer}>
                <ActivityIndicator color={colors.secondary} size="large" />
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    LoaderContainer: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.8)"
    }
})