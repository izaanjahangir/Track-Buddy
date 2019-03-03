import { Toast } from 'native-base';
import { Location, Permissions } from 'expo';
const randomHex = require('crypto-random-hex');

const showToast = (text, buttonText, type, duration = 3000) => {
    Toast.show({ text, buttonText, type, duration })
}

const makeBlobFromURI = (uri) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

}

const extractFormatFromImageURI = (uri) => {
    const last6Char = uri.slice(uri.length - 6);
    const arr = last6Char.split(".");
    return arr[1];
}

const getLocation = async () => {
    try {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            throw { message: "We need your location to properly show services" }
        }

        let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });

        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        }
    } catch (e) {
        throw e
    }
}

const createRandomString = () => {
    return Math.random().toString(36).substring(7);
}

export default {
    showToast,
    makeBlobFromURI,
    extractFormatFromImageURI,
    getLocation,
    createRandomString
}