import { Toast } from 'native-base';

const showToast = (text, buttonText, type, duration = 3000) => {
    Toast.show({ text, buttonText, type, duration })
}

export default {
    showToast
}