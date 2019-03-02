import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

export default {
    WINDOW_WIDTH: width,
    WINDOW_HEIGHT: height,
    MEDIUM_PADDING_VERTICAL: height * 0.05,
    SMALL_PADDING_VERTICAL: height * 0.01,
    MEDIUM_TEXT: width * 0.07,
    SMALL_TEXT: width * 0.05,
    SMALL_MARGIN_VERTICAL: height * 0.01,
}