import { StyleSheet } from 'react-native';

import variables from '../../config/variables';

export default StyleSheet.create({
    picker: {
        position: "absolute",
        top: 10,
        alignSelf: "center",
        borderColor: "black",
        paddingHorizontal: 5,
        borderWidth: 0.5,
        width: variables.WINDOW_WIDTH * 0.9,
        backgroundColor: "white"
    },
    absoluteButton: {
        position: "absolute",
        bottom: 10,
        alignSelf: "center",
        // paddingHorizontal: 5,
        width: variables.WINDOW_WIDTH * 0.9,
    }
})