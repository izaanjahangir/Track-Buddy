import { StyleSheet } from 'react-native';

import colors from '../config/colors';
import variables from '../config/variables';

export default StyleSheet.create({
    container: {
        paddingHorizontal: variables.WINDOW_WIDTH * 0.05,
        flex: 1
    },
    containerPadding: {
        paddingHorizontal: variables.WINDOW_WIDTH * 0.05,
    },
    flexFull: {
        flex: 1
    },
    perfectlyCentered: {
        justifyContent: "center",
        alignItems: "center"
    },
    justifyContentEnd: {
        justifyContent: "flex-end"
    },
    alignItemsCenter: {
        alignItems: "center"
    },
    mediumPaddingBottom: {
        paddingBottom: variables.MEDIUM_PADDING_VERTICAL
    },
    fullWidthHeight: {
        width: variables.WINDOW_WIDTH,
        height: variables.WINDOW_HEIGHT,
    },
    bgPrimary: {
        backgroundColor: colors.primary
    },
    bgSecondary: {
        backgroundColor: colors.secondary
    },
    smallText: {
        fontSize: variables.SMALL_TEXT
    },
    smallMarginY: {
        marginTop: variables.SMALL_MARGIN_VERTICAL,
        marginBottom: variables.SMALL_MARGIN_VERTICAL,
    },
    smallPaddingY: {
        marginTop: variables.SMALL_PADDING_VERTICAL,
        marginBottom: variables.SMALL_PADDING_VERTICAL,
    },
    textCenter: { textAlign: "center" }
})